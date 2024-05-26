module default {
    type Author {
        required name: str {
            constraint exclusive;
        };
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        };
        works := .<author[is Src];
    }

    type Src {
        required title: str;
        url: str;
        required author: Author;
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        };
        constraint exclusive on ((.title, .author));
    }

    type User {
        clerk_id: str {
            constraint exclusive;
        };
        display_name: str;
        required anonymous: bool {
            default := false;
        };
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }
    }

    type Quote {
        required text: str;
        src: Src;
        day: int16 {
            constraint min_value(0); #Sunday
            constraint max_value(6); #Saturday
        };
        highlight: tuple<`start`: int16, `end`: int16> {
            constraint expression on (.`start` < .`end`);
        };
        submitted_by: User;
        verified_by: User;
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }
    }
}
