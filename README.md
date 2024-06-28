## Implementation of Chart View ## 


### Here is the list of thing need to implement

1. backend - need one api who's gonna return filter data from sqlite itself
2. frontend - need to implement API from backend its gonna piece of cake after backend api

### requirements to build chart 

Required Filters

```
{
    expiry date
    strike price
}
```

response
```
{
    expiry date: {
        strike price: {
            time: {
                call_ltp
                call_chng_in_io
                put_ltp
                put_chng_in_io
                ltd_diff
                ltd_diff
            }
        }
    }

}
```