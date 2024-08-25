CREATE MIGRATION m17kog23raf5v355ylnggpitltxtf7ubbjcjgawocv2zpe45d55z7q
    ONTO m1fqi23ljyjxvotxlmo2bwvqxuet7midqhsund3e4v36hfwjdkstoq
{
  CREATE TYPE default::TimePeriod {
      CREATE REQUIRED LINK quote: default::Quote {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY period: range<std::int32>;
      CREATE REQUIRED PROPERTY specific: std::bool;
  };
  ALTER TYPE default::Quote {
      CREATE LINK times := (.<quote[IS default::TimePeriod]);
  };
};
