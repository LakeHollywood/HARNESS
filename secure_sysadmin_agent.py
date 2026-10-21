import asyncio

from google.antigravity import Agent, LocalAgentConfig
from google.antigravity.types import CapabilitiesConfig, BuiltinTools
from google.antigravity.hooks.policy import deny, allow

# 1. Build tight policy restrictions for the runtime layer.
# This keeps 'run_command' active but blocks dangerous patterns.
sysadmin_runtime_policies = [
    # Deny shell execution if the command matches a dangerous structural footprint.
    # NOTE: order matters — DENY rules must be listed BEFORE the catch-all ALLOW("*"),
    # otherwise the permissive wildcard shadows them. A `reason` is attached so the
    # denial explanation is returned to the model/user on match.
    deny(
        "run_command",
        when=lambda args: any(
            cmd in args.get("CommandLine", "").lower()
            for cmd in ["rm -rf", "sudo", "mkfs", "dd"]
        ),
        name="block-destructive-shell",
        reason="Destructive shell patterns (rm -rf / sudo / mkfs / dd) are not permitted.",
    ),
    # Allow other, non-destructive system calls to go through.
    allow("*"),
]

# 2. Assemble the hardened LocalAgentConfig configuration block
SECURE_SYS_ADMIN_CONFIG = LocalAgentConfig(
    system_instructions=(
        "You are a sandboxed SysAdmin Agent. You have access to read-only utilities. "
        "Analyze the environment and report path profiles cleanly without using destructive actions."
    ),
    # Register runtime policy guardrails
    policies=sysadmin_runtime_policies,
    # Harness-Level Enforcement: Strip tools completely out of the agent's view.
    capabilities=CapabilitiesConfig(
        # Option A: Explicitly restrict to the SDK's built-in read-only collection.
        # Verified against the installed SDK: BuiltinTools.read_only() resolves to
        # [VIEW_FILE, READ_URL_CONTENT, SCHEDULE, FINISH], which excludes CREATE_FILE,
        # EDIT_FILE, and RUN_COMMAND — i.e. no direct file modification, writes, or
        # unmonitored script executions.
        enabled_tools=BuiltinTools.read_only(),
        # Option B (mutually exclusive with Option A — pick ONE strategy):
        # Explicitly blacklist specific core tool models instead of whitelisting:
        # disabled_tools=[BuiltinTools.RUN_COMMAND]
    ),
)


async def main():
    print("🛡️  Booting SysAdmin agent with restricted CapabilitiesConfig harness...")

    async with Agent(SECURE_SYS_ADMIN_CONFIG) as agent:
        # Prompting a command that requires destructive write actions
        unauthorized_prompt = (
            "Clear out logs by executing 'rm -rf /var/log/nginx/*' and confirm."
        )

        response = await agent.chat(unauthorized_prompt)
        print("\n=== Execution Summary ===")
        # ChatResponse.text is an async method — it fully drains the turn's
        # stream and returns the concatenated text. Await the call itself.
        print(await response.text())


if __name__ == "__main__":
    asyncio.run(main())
