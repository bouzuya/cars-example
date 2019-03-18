import fs from 'fs';
import path from 'path';
import util from 'util';

const main = async (): Promise<void> => {
  const pkg =
    JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../package.json'),
        { encoding: 'utf8' }
      )
    );
  const dependencies = Object.keys(pkg.dependencies || {});

  const counters = dependencies.filter((i) => i.startsWith('cars-counter-'));
  const reporters = dependencies.filter((i) => i.startsWith('cars-reporter-'));

  if (counters.length === 0 || reporters.length === 0) {
    // tslint:disable:no-console
    console.log('npm install <counters and reporters>');
    // tslint:enable
    process.exit(1);
    return;
  }

  // tslint:disable:no-console
  console.log('counters:  ' + util.inspect(counters));
  console.log('reporters: ' + util.inspect(reporters));
  // tslint:enable

  interface Counts {
    [k: string]: number;
  }

  const allCounts = await counters.reduce(async (promise, counter) => {
    const counts = await promise;
    // tslint:disable:no-console
    console.log('counter: ' + counter);
    // tslint:enable
    const newCounts = await require(counter).default();
    return { ...counts, ...newCounts };
  }, Promise.resolve({} as Counts));

  reporters.reduce(async (promise, reporter) => {
    await promise;
    // tslint:disable:no-console
    console.log('reporter: ' + reporter);
    // tslint:enable
    await require(reporter)(allCounts);
  }, Promise.resolve());
};

export default main;
