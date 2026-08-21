from typing import Protocol


class BrowserAdapter(Protocol):

    def inspect_fields(self) -> list[str]:
        """
        Return the currently visible form field labels
        on the supplier webpage.
        """
        ...

    def fill_field(self, field_name: str, value: str) -> bool:
        """
        Fill a specific webpage field.

        Returns True if successful.
        """
        ...

    def submit_quote_request(self) -> bool:
        """
        Submit the quote request if the workflow
        allows submission.
        """
        ...