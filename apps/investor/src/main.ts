import { Command } from "commander";
import { makeStockCommand } from "./app/cmd/stock-cmd.ts";

if (import.meta.main) {
  const program = new Command();

  program.name("").description("").version("");

  program.addCommand(makeStockCommand());

  await program.parseAsync();
}
