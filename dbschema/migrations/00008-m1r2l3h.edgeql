CREATE MIGRATION m1r2l3hrumb5lasnxlz6cluawfmtpgpgneizz47f62xldwaybclo2q
    ONTO m1fxy52cdfdtjx3s4vwjqfnn64sbk3m64eijv7fatzv6flkuo3oida
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY deleted: std::bool {
          SET default := false;
      };
  };
};
