CREATE MIGRATION m13vbgbugk2egvchxaqlsk457722k3jzw6vqnqfth2t37osx4inxcq
    ONTO m1jf7wbutu27732vobuoz34ywjqnaog56zxlmipuzmv7axg7aibkga
{
  ALTER TYPE default::Author {
      CREATE REQUIRED PROPERTY created: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  ALTER TYPE default::Quote {
      CREATE REQUIRED PROPERTY created: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  ALTER TYPE default::Src {
      CREATE REQUIRED PROPERTY created: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY created: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
};
