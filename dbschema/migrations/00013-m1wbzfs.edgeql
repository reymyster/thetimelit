CREATE MIGRATION m1wbzfsknynksovgzapzxbqgtzqgs7fqs76tnjhq7la7v5ftvooyda
    ONTO m1zl423cgne4vlmzdij3oajldb63pjuk7ik4l3ia5shvnpij2qnp3q
{
  ALTER TYPE default::Quote {
      CREATE PROPERTY time: tuple<period: range<std::int32>, specific: std::bool>;
  };
};
