use Mix.Config

# Configure your database
config :pyairwaves, Pyairwaves.Repo,
  username: "postgres",
  password: "postgres",
  database: "pyairwaves_test",
  hostname: "database",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :pyairwaves, PyairwavesWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
