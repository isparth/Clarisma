from sqlalchemy import text
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.models import Item as DBItem  # Rename to avoid conflict with Pydantic model
from app.schemas import Item as ItemSchema, ItemCreate

router = APIRouter()

@router.post("/items/", response_model=ItemSchema)  # Use Pydantic model for response
async def create_item(item: ItemCreate, session: AsyncSession = Depends(get_session)):
    new_item = DBItem(name=item.name)  # Use DBItem for database operations
    session.add(new_item)
    await session.commit()
    await session.refresh(new_item)
    return new_item  # FastAPI will automatically serialize DBItem to ItemSchema

@router.get("/items/", response_model=List[ItemSchema], response_model_exclude_unset=True)  # Skip validation if needed
async def read_items(session: AsyncSession = Depends(get_session)):
    result = await session.execute(text("SELECT * FROM items"))
    items = result.mappings().all()  # Return as list of dicts instead of ORM objects
    return items