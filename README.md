# chirpy_ts
Boot.dev http sever example

## Start Postgres

```bash
sudo service postgresql start
```

## Requires

### Express:

```bash
npm i express
npm i -D @types/express
```

### Postgres:

Install:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

sudo passwd postgres

sudo -u postgres psql

CREATE DATABASE chirpyts;
\c "chripy-ts"

ALTER USER postgres PASSWORD 'postgres';
```

### Drizzle:

Install:

```bash
npm i drizzle-orm postgres
npm i -D drizzle-kit
```

### bcrypt:

Install:

```bash
npm i bcrypt
npm i -D @types/bcrypt
```

### JSONWebToken

```bash
npm i jsonwebtoken
npm i -D @types/jsonwebtoken
```

### vitest

```bash
npm i -D vitest
```

