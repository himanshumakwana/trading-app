package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type IndexStruct struct {
	Key         string  `json:"key"`
	Index       string  `json:"index"`
	IndexSymbol string  `json:"indexSymbol"`
	Last        float32 `json:"last"`
	Variation   float32 `json:"variation"`
	PerChange   float32 `json:"percentChange"`
	Open        float32 `json:"open"`
	High        float32 `json:"high"`
	Low         float32 `json:"low"`
	PreClose    float32 `json:"previousClose"`
	YearHigh    float32 `json:"yearHigh"`
	YearLow     float32 `json:"yearLow"`
	PE          string  `json:"pe"`
	PB          string  `json:"pb"`
	DY          string  `json:"dy"`
	Declines    string  `json:"declines"`
	Advances    string  `json:"advances"`
	Unchanged   string  `json:"unchanged"`
}

type RecordStruct struct {
	ExpiryDates     []string    `json:"expiryDates"`
	Data            []Data      `json:"data"`
	Timestamp       string      `json:"timestamp"`
	UnderlyingValue float32     `json:"underlyingValue"`
	StrikePrices    []float32   `json:"strikePrices"`
	Index           IndexStruct `json:"index"`
}

type OptionStruct struct {
	StrikePrice           float32 `json:"strikePrice"`
	ExpiryDate            string  `json:"expiryDate"`
	Underlying            string  `json:"underlying"`
	Identifier            string  `json:"identifier"`
	OpenInterest          float32 `json:"openInterest"`
	ChangeinOpenInterest  float32 `json:"changeinOpenInterest"`
	PchangeinOpenInterest float32 `json:"pchangeinOpenInterest"`
	TotalTradedVolume     float32 `json:"totalTradedVolume"`
	ImpliedVolatility     float32 `json:"impliedVolatility"`
	LastPrice             float32 `json:"lastPrice"`
	Change                float32 `json:"change"`
	PChange               float32 `json:"pChange"`
	TotalBuyQuantity      float32 `json:"totalBuyQuantity"`
	TotalSellQuantity     float32 `json:"totalSellQuantity"`
	BidQty                float32 `json:"bidQty"`
	Bidprice              float32 `json:"bidprice"`
	AskQty                float32 `json:"askQty"`
	AskPrice              float32 `json:"askPrice"`
	UnderlyingValue       float32 `json:"underlyingValue"`
}

type Data struct {
	StrikePrice float32      `json:"strikePrice"`
	ExpireDate  string       `json:"expiryDate"`
	PE          OptionStruct `json:"PE,omitempty"`
	CE          OptionStruct `json:"CE,omitempty"`
}

type CEStruct struct {
	TotIO  float32 `json:"totOI"`
	TotVol float32 `json:"totVol"`
}

type FilteredStruct struct {
	Data []Data   `json:"data"`
	CE   CEStruct `json:"CE,omitempty"`
	PE   CEStruct `json:"PE,omitempty"`
}

type Response struct {
	Records  RecordStruct   `json:"records"`
	Filtered FilteredStruct `json:"filtered"`
}

func main() {
	r := gin.Default()
	gin.SetMode(gin.ReleaseMode)

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders: []string{"Content-Type,access-control-allow-origin, access-control-allow-headers"},
	}))

	r.GET("/", func(c *gin.Context) {
		index := c.Query("index")

		fmt.Println(index)

		client := &http.Client{}

		if index == "" {
			c.AbortWithError(400, fmt.Errorf("Query: index not found"))
		}

		req, err := http.NewRequest("GET", fmt.Sprintf("https://www.nseindia.com/api/option-chain-indices?symbol=%s", c.Query("index")), nil)
		if err != nil {
			log.Fatalln(err)
		}

		req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36")

		resp, err := client.Do(req)

		if err != nil {
			fmt.Println("Error :", err)
			c.AbortWithError(500, fmt.Errorf("Error from NSE"))
			return
		}
		defer resp.Body.Close()

		// Read the response body
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			// Handle error
			log.Fatal("Error ", err)
		}

		// Decode the JSON response float32o a Todo struct
		var obj Response
		err = json.Unmarshal(body, &obj)
		if err != nil {
			fmt.Println("Error :", err)
			c.AbortWithError(500, fmt.Errorf("Error from NSE <"))
			return
		}

		c.JSON(200, obj)
	})

	r.Run(":8080")
}
