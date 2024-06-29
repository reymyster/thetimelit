CREATE MIGRATION m1r3ajyy6tcqvr6w7swhnc7mdain4wecx5xhwknfk4rfdoomg63ryq
    ONTO m1r2l3hrumb5lasnxlz6cluawfmtpgpgneizz47f62xldwaybclo2q
{
  ALTER TYPE default::Quote {
      DROP CONSTRAINT std::expression ON ((NOT ((EXISTS (.auth) OR EXISTS (.src))) OR ((EXISTS (.auth) OR EXISTS (.src)) AND NOT ((EXISTS (.auth) AND EXISTS (.src))))));
  };
};
