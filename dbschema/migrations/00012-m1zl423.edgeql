CREATE MIGRATION m1zl423cgne4vlmzdij3oajldb63pjuk7ik4l3ia5shvnpij2qnp3q
    ONTO m1s7wchvedqaykd3s6oi6hhu7p2xo565jw2nlfpzko646mdirisroq
{
  ALTER TYPE default::Quote {
      DROP PROPERTY time;
  };
};
