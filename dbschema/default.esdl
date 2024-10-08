module default {
    type Author {
        required name: str {
            constraint exclusive;
        };
        required created_at: datetime {
            default := datetime_of_statement();
            readonly := true;
        };
        modified_at: datetime {
            rewrite insert, update using (datetime_of_statement())
        };
        works := .<author[is Src];
        required deleted: bool {
            default := false;
        };
    }

    type Src {
        required title: str;
        url: str;
        required author: Author;
        required created_at: datetime {
            default := datetime_of_statement();
            readonly := true;
        };
        modified_at: datetime {
            rewrite insert, update using (datetime_of_statement())
        };
        constraint exclusive on ((.title, .author));
        required deleted: bool {
            default := false;
        };
    }

    type User {
        clerk_id: str {
            constraint exclusive;
        };
        display_name: str;
        required anonymous: bool {
            default := false;
        };
        required created_at: datetime {
            default := datetime_of_statement();
            readonly := true;
        };
        modified_at: datetime {
            rewrite insert, update using (datetime_of_statement())
        };
        required deleted: bool {
            default := false;
        };
    }

    type TimePeriod {
        required quote: Quote {
            on target delete delete source;
        }
        required period: range<int32>;
        required specific: bool;
    }

    type Quote {
        required text: str;
        auth: Author;
        src: Src;
        day: int16 {
            constraint min_value(0); #Sunday
            constraint max_value(6); #Saturday
        };
        time: tuple<period: range<int32>, specific: bool>;
        times := .<quote[is TimePeriod];
        highlight: tuple<startOffset: int16, endOffset: int16> {
            constraint expression on (.startOffset < .endOffset and .startOffset >= 0);
        };
        submitted_by: User;
        verified_by: User;
        required created_at: datetime {
            default := datetime_of_statement();
            readonly := true;
        };
        modified_at: datetime {
            rewrite insert, update using (datetime_of_statement())
        };

        proposedAuthor: str;
        proposedSource: str;
        required deleted: bool {
            default := false;
        };
    }
}
