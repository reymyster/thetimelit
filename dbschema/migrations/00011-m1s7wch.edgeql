CREATE MIGRATION m1s7wchvedqaykd3s6oi6hhu7p2xo565jw2nlfpzko646mdirisroq
    ONTO m1ziswcj2xfr2yj3przhla5uw26iu5vetucuth3afjskouuqdvmoxa
{
  ALTER TYPE default::Quote {
      CREATE PROPERTY highlight: tuple<startOffset: std::int16, endOffset: std::int16> {
          CREATE CONSTRAINT std::expression ON (((.startOffset < .endOffset) AND (.startOffset >= 0)));
      };
  };
};
