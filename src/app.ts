import express from 'express';
import cars from './cars';

class App {
  public run(): void {
    const app = express();

    app.get('/', (_, res) => {
      res.send('OK');
    });

    app.post('/:token', (req, res) => {
      const token = req.params.token;
      if (process.env.CARS_TOKEN && token === process.env.CARS_TOKEN) {
        // tslint:disable:no-console
        console.log('valid token');
        // tslint:enable
        cars().then(
          () => void res.send('OK'),
          () => void res.send('NG')
        );
      } else {
        // tslint:disable:no-console
        console.error('invalid token: ' + token);
        // tslint:enable
        res.send('NG');
      }
    });

    app.listen(process.env.PORT || 3000);
  }
}

export { App };
