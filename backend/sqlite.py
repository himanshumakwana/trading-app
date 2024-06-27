from peewee import *
from datetime import datetime


# Define the database
db = SqliteDatabase('nseoptions.db')

# Define the base model
class BaseModel(Model):
    class Meta:
        database = db

# Define the User model
class OptionChainNifty(BaseModel):
    expiry_dates = CharField()
    strike_price = IntegerField()

    # CE info
    ce_io = DecimalField()
    ce_chng_in_io = DecimalField()
    ce_ltp = DecimalField()

    # PE info
    pe_io = DecimalField()
    pe_chng_in_io = DecimalField()
    pe_ltp = DecimalField()

    # analysis on CE and PE
    ltp_diff = DecimalField()
    adjustment = DecimalField()
    chng_in_oi_diff = DecimalField()
    chng_in_oi_pcr = DecimalField(default=0)
    pcr = DecimalField(default=0)

    # overall pcr
    ce_total_oi = DecimalField()
    pe_total_oi = DecimalField()
    total_pcr = DecimalField(default=0)

    # whole response for future analysis purpose
    json_res = TextField()

    # created at
    created_at = DateTimeField(default=datetime.now)

# Connect to the database and create tables
db.connect()
db.create_tables([OptionChainNifty])
