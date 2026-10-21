import asyncio

from google.antigravity import Agent, LocalAgentConfig
from google.antigravity.types import CapabilitiesConfig, BuiltinTools
from google.antigravity.hooks.policy import deny, allow

# 1. Build tight policy restrictions for the runtime layer.
# With Option B (blacklist-only), 'run_command' STAYS ENABLED, so these runtime
# policies are the primary defense against destructive shell execution.
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
        "You are a sandboxed SysAdmin Agent. Shell access is available but heavily "
        "policy-restricted. Analyze the environment and report path profiles cleanly "
        "without using destructive actions."
    ),
    # Register runtime policy guardrails (now load-bearing: run_command is live)
    policies=sysadmin_runtime_policies,
    # Harness-Level Enforcement: Option B — blacklist-only strategy.
    # The SDK validates that enabled_tools and disabled_tools are mutually exclusive,
    # so we drop the read_only() whitelist entirely and only strip the direct-write
    # tools. 'run_command' remains visible/enabled and is governed by the runtime
    # deny policy above; 'create_file' and 'edit_file' are removed from the agent's
    # view so it cannot bypass the shell guardrails via the file-writing tools.
    capabilities=CapabilitiesConfig(
        disabled_tools=[BuiltinTools.CREATE_FILE, BuiltinTools.EDIT_FILE],
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
