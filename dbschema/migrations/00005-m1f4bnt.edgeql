CREATE MIGRATION m1f4bntozxhrpn3jalng44wz6pooxlrprrmjtwlv3dk2um76tjnuwq
    ONTO m1pvqt33pyjphmhu5q5r5h3hrzpvihzrjvfgumrnu2iuh2us64lf5a
{
  ALTER TYPE default::Quote {
      CREATE LINK auth: default::Author;
      CREATE CONSTRAINT std::expression ON (((EXISTS (.auth) OR EXISTS (.src)) AND NOT ((EXISTS (.auth) AND EXISTS (.src)))));
  };
  ALTER TYPE default::Quote {
      ALTER PROPERTY highlight {
          CREATE CONSTRAINT std::expression ON (((.`start` < .`end`) AND (.`start` >= 0)));
      };
  };
  ALTER TYPE default::Quote {
      ALTER PROPERTY highlight {
          DROP CONSTRAINT std::expression ON ((.`start` < .`end`));
      };
      CREATE PROPERTY hour: tuple<`start`: std::int16, `end`: std::int16> {
          CREATE CONSTRAINT std::expression ON ((((.`start` <= .`end`) AND (.`start` >= 0)) AND (.`end` <= 23)));
      };
      CREATE PROPERTY minute: tuple<`start`: std::int16, `end`: std::int16> {
          CREATE CONSTRAINT std::expression ON ((((.`start` <= .`end`) AND (.`start` >= 0)) AND (.`end` <= 59)));
      };
      CREATE PROPERTY proposedAuthor: std::str;
      CREATE PROPERTY proposedSource: std::str;
  };
};
