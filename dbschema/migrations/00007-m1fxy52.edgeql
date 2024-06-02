CREATE MIGRATION m1fxy52cdfdtjx3s4vwjqfnn64sbk3m64eijv7fatzv6flkuo3oida
    ONTO m1cfe4uia6wrqepoiqbaqg7twqylbrg4p3527pqdjhohrd7ihpufhq
{
  ALTER TYPE default::Quote {
      DROP CONSTRAINT std::expression ON (((EXISTS (.auth) OR EXISTS (.src)) AND NOT ((EXISTS (.auth) AND EXISTS (.src)))));
  };
  ALTER TYPE default::Quote {
      CREATE CONSTRAINT std::expression ON ((NOT ((EXISTS (.auth) OR EXISTS (.src))) OR ((EXISTS (.auth) OR EXISTS (.src)) AND NOT ((EXISTS (.auth) AND EXISTS (.src))))));
  };
};
