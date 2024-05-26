CREATE MIGRATION m1jf7wbutu27732vobuoz34ywjqnaog56zxlmipuzmv7axg7aibkga
    ONTO m1jwpjxkbk7iqwlu2j5lmkkadieawultqatirwuduydjodtqhdf56a
{
  ALTER TYPE default::Author {
      CREATE LINK works := (.<author[IS default::Src]);
  };
};
