CREATE MIGRATION m1ziswcj2xfr2yj3przhla5uw26iu5vetucuth3afjskouuqdvmoxa
    ONTO m1r3ajyy6tcqvr6w7swhnc7mdain4wecx5xhwknfk4rfdoomg63ryq
{
  ALTER TYPE default::Quote {
      DROP PROPERTY highlight;
  };
};
