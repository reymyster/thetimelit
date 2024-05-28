CREATE MIGRATION m1pvqt33pyjphmhu5q5r5h3hrzpvihzrjvfgumrnu2iuh2us64lf5a
    ONTO m13vbgbugk2egvchxaqlsk457722k3jzw6vqnqfth2t37osx4inxcq
{
  ALTER TYPE default::Author {
      ALTER PROPERTY created {
          RENAME TO created_at;
      };
  };
  ALTER TYPE default::Author {
      ALTER PROPERTY modified {
          RENAME TO modified_at;
      };
  };
  ALTER TYPE default::Quote {
      ALTER PROPERTY created {
          RENAME TO created_at;
      };
  };
  ALTER TYPE default::Quote {
      ALTER PROPERTY modified {
          RENAME TO modified_at;
      };
  };
  ALTER TYPE default::Src {
      ALTER PROPERTY created {
          RENAME TO created_at;
      };
  };
  ALTER TYPE default::Src {
      ALTER PROPERTY modified {
          RENAME TO modified_at;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY created {
          RENAME TO created_at;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY modified {
          RENAME TO modified_at;
      };
  };
};
