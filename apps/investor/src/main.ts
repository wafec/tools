import { Command } from "commander";
import { makeStockCommand } from "./cmd/stock-cmd.ts";
import { makeReitCommand } from "./cmd/reit/commands.ts";

if (import.meta.main) {
  const program = new Command();

  program.name("investor").description("").version("0.1.0");

  program.addCommand(makeStockCommand());
  program.addCommand(makeReitCommand());

  await program.parseAsync();
}
