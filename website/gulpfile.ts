import gulp from "gulp";
import path from "path";
import { ChildProcess, spawn, SpawnOptions } from "child_process";
import getPort from "get-port";
import http from "http";
import { linkExamples } from "./scripts/link-examples";
import { unlinkExamples } from "./scripts/unlink-examples";
import { allExamples } from "./scripts/constants";
import { upgradeDeps } from "./scripts/upgrade-deps";

function requireFresh(pkg: string) {
  delete require.cache[require.resolve(pkg)];
  return require(pkg);
}

const serviceRegistry = new Map<string, ChildProcess>();

const runService = (
  command: string,
  args: string,
  opts: SpawnOptions = { stdio: "inherit" },
  shouldRestart = false
) => {
  const name = `${command} ${args}`;
  const proc = serviceRegistry.get(name);
  if (proc && shouldRestart) {
    console.log(`killing ${name}`);
    proc.kill();
  }
  if (shouldRestart || !proc) {
    serviceRegistry.set(name, spawn(command, args.split(" "), opts));
  }
};

gulp.task("api-types", [], async () => {
  const { run } = requireFresh("./api/types/types-to-json.ts");
  await run();
});

gulp.task("watch:api-types", ["core-tsc", "api-types"], () => {
  gulp.watch(
    [
      path.join(__dirname, "../dist/*.d.ts"),
      path.join(__dirname, "./api/types/*.ts"),
    ],
    ["api-types"]
  );
});

gulp.task("docusaurus", () => {
  runService("yarn", "docusaurus-start", { stdio: "ignore" }, true);
});
gulp.task("webpack", () => {
  runService("yarn", "webpack", { stdio: "ignore" });
});
gulp.task("api-tsc", () => {
  runService("yarn", "tsc -w -p api/tsconfig.json", { stdio: "ignore" });
});
gulp.task("core-tsc", () => {
  runService("yarn", "tsc -w -p tsconfig.json", {
    stdio: "ignore",
    cwd: path.join(__dirname, ".."),
  });
});

gulp.task(
  "start",
  ["docusaurus", "webpack", "watch:api-types", "api-tsc", "core-tsc"],
  () => {
    console.log("Server starting, please wait...");
    gulp.watch(path.join(__dirname, "siteConfig.js"), ["docusaurus"]);
  }
);

gulp.task("run-examples", async () => {
  for (let i = 0; i < allExamples.length; i++) {
    const example = allExamples[i];
    const port = await getPort({
      port: [4000, 4001, 4002, 4003, 4004, 4005, 4006],
    });
    console.log(`Starting ${example} on port ${port}`);
    spawn("yarn", ["run", "start"], {
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: `${port}`,
      },
      stdio: "inherit",
      cwd: path.join(__dirname, `../examples/${example}`),
    });
    let ready = false;
    while (!ready) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      ready = await new Promise<boolean>((resolve) => {
        http
          .get(`http://localhost:${port}/`, () => resolve(true))
          .on("error", () => resolve(false));
      });
    }
  }
});

gulp.task("check-examples", ["link-examples"], async () => {});

gulp.task("link-examples", async () => {
  await linkExamples();
  console.log("All examples linked");
});

gulp.task("unlink-examples", async () => {
  await unlinkExamples();
  console.log("All examples unlinked");
});

gulp.task("upgrade-deps", async () => {
  await upgradeDeps();
  console.log("All dependencies upgraded");
});
