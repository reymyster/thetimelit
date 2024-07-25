CREATE MIGRATION m1fqi23ljyjxvotxlmo2bwvqxuet7midqhsund3e4v36hfwjdkstoq
    ONTO m1wbzfsknynksovgzapzxbqgtzqgs7fqs76tnjhq7la7v5ftvooyda
{
  ALTER TYPE default::Author {
      CREATE REQUIRED PROPERTY deleted: std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::Quote {
      CREATE REQUIRED PROPERTY deleted: std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::Src {
      CREATE REQUIRED PROPERTY deleted: std::bool {
          SET default := false;
      };
  };
};
