import { Command } from "commander";
import { makeStockCommand } from "./app/cmd/stock-cmd.ts";
import { makeReitCommand } from "./app/cmd/reit-cmd.ts";

if (import.meta.main) {
  const program = new Command();

  program.name("investor").description("").version("0.1.0");

  program.addCommand(makeStockCommand());
  program.addCommand(makeReitCommand());

  await program.parseAsync();
}
