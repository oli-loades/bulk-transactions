# Bulk Transactions
## Description

A NestJS API to handle transaction processing in bulk. Utilises BullMQ to handle processing fo individual transaction after bulk upload.

## Infrastructure Dependencies
I have added a docker compose file to create the below services with default configurations.
- MongoDB
- Redis

## Env setup
See `.env.example` for required properties

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints
### bulk-trabnsaction
`POST /bulk-transactions`

Expected request body format:
```json
{
  transactions[{
    value: number,
    account: string
  }]
}
```

Expected Response body format:
```json
[{
  id: string, 
  status: 'PENDING',
  value: number,
  account: string
}]
```
