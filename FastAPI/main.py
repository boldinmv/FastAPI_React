import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine, Base
from routers import customer as CustomerRouter
from routers import product as ProductRouter
from routers import order as OrderRouter

Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(CustomerRouter.router, prefix="/customer")
app.include_router(ProductRouter.router, prefix="/product")
app.include_router(OrderRouter.router, prefix="/order")

if __name__ == '__main__':
    uvicorn.run("main:app", host='0.0.0.0', port=8000, reload=True, workers=1)