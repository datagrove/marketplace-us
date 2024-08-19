CREATE SERVER stripe_server FOREIGN DATA WRAPPER stripe_wrapper OPTIONS (api_key_id 'placeholder');

CREATE PROCEDURE install_stripe_secret_reference() AS $$
    DECLARE
        vault_key_id TEXT;
    BEGIN
        SELECT key_id::TEXT FROM vault.secrets WHERE name='stripe' INTO vault_key_id;
        IF vault_key_id IS NOT NULL THEN
            EXECUTE 'ALTER SERVER stripe_server OPTIONS (SET api_key_id ' || quote_literal(vault_key_id) || ')';
        END IF;
    END
$$ LANGUAGE PLPGSQL;
COMMENT ON PROCEDURE install_stripe_secret_reference() IS 'Look up the Stripe key_id from the vault and set it in the server wrapper';

REVOKE ALL ON PROCEDURE install_stripe_secret_reference FROM PUBLIC,authenticated,anon;

CALL install_stripe_secret_reference();

create schema stripe;

create foreign table stripe.prices (
  id text,
  active bool,
  currency text,
  product text,
  unit_amount bigint,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'prices'
  );