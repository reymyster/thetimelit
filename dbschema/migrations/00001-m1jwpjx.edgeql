CREATE MIGRATION m1jwpjxkbk7iqwlu2j5lmkkadieawultqatirwuduydjodtqhdf56a
    ONTO initial
{
  CREATE TYPE default::Author {
      CREATE PROPERTY modified: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Src {
      CREATE REQUIRED LINK author: default::Author;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE CONSTRAINT std::exclusive ON ((.title, .author));
      CREATE PROPERTY modified: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY url: std::str;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY anonymous: std::bool {
          SET default := false;
      };
      CREATE PROPERTY clerk_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY display_name: std::str;
      CREATE PROPERTY modified: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::Quote {
      CREATE LINK src: default::Src;
      CREATE LINK submitted_by: default::User;
      CREATE LINK verified_by: default::User;
      CREATE PROPERTY day: std::int16 {
          CREATE CONSTRAINT std::max_value(6);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY highlight: tuple<`start`: std::int16, `end`: std::int16> {
          CREATE CONSTRAINT std::expression ON ((.`start` < .`end`));
      };
      CREATE PROPERTY modified: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY text: std::str;
  };
};
