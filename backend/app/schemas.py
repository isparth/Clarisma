from pydantic import BaseModel
from typing import List

class ItemBase(BaseModel):
    name: str

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int  # Assuming your Item model has an ID field

    class Config:
        from_attributes = True  # Required for from_orm to work in Pydantic v2