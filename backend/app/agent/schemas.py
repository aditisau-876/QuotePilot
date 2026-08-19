from pydantic import BaseModel, Field, field_validator


class ProcurementRequirements(BaseModel):
    product: str = Field(
        description="The product or item the user wants to procure."
    )

    quantity: int = Field(
        description="Number of units required."
    )

    delivery_location: str | None = Field(
        default=None,
        description="Location where the products should be delivered."
    )

    max_delivery_days: int | None = Field(
        default=None,
        description="Maximum acceptable delivery time in days."
    )

    min_warranty_years: float | None = Field(
        default=None,
        description="Minimum required warranty period in years."
    )

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Quantity must be greater than 0.")
        return value

    @field_validator("max_delivery_days")
    @classmethod
    def validate_delivery_days(cls, value: int | None) -> int | None:
        if value is not None and value <= 0:
            raise ValueError("Delivery days must be greater than 0.")
        return value

    @field_validator("min_warranty_years")
    @classmethod
    def validate_warranty(cls, value: float | None) -> float | None:
        if value is not None and value < 0:
            raise ValueError("Warranty cannot be negative.")
        return value