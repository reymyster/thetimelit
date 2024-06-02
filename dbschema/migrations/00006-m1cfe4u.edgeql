CREATE MIGRATION m1cfe4uia6wrqepoiqbaqg7twqylbrg4p3527pqdjhohrd7ihpufhq
    ONTO m1f4bntozxhrpn3jalng44wz6pooxlrprrmjtwlv3dk2um76tjnuwq
{
  ALTER TYPE default::Quote {
      DROP PROPERTY hour;
      DROP PROPERTY minute;
  };
  ALTER TYPE default::Quote {
      CREATE PROPERTY time: tuple<period: range<std::int32>, fullday: std::bool>;
  };
};
