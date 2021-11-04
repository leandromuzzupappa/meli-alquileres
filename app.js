const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3001;

app.listen(PORT, () => console.log("Escuchando puerto " + PORT));

const URL =
  "https://inmuebles.mercadolibre.com.ar/alquiler/capital-federal/_Desde_1_PriceRange_0ARS-70000ARS";

app.get("/", (req, res) => {
  axios
    .get(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const rentals = [];

      const meliItem = ".ui-search-layout__item";

      $(meliItem, html).each(function () {
        const meliClasses = {
          imgurl: ".ui-search-result-image__element",
          price: ".price-tag-fraction",
          title: ".ui-search-item__title",
          location: ".ui-search-item__location",
          attributes: ".ui-search-card-attributes__attribute",
          url: ".ui-search-link",
        };

        const imgUrl = $(this).find(meliClasses.imgurl).attr("data-src");
        const price = $(this).find(meliClasses.price).text();
        const title = $(this).find(meliClasses.title).text();

        const location = $(this).find(meliClasses.location).text();
        const attributes = $(this).find(meliClasses.attributes);

        const [address, city, region] = location.split(",");

        const size = attributes[0]?.children[0].data;
        const rooms = attributes[1]?.children[0].data;
        const url = $(this).find(meliClasses.url).attr("href");

        return rentals.push({
          imgUrl,
          price,
          title,
          address,
          city,
          region,
          size,
          rooms,
          url,
        });
      });

      res.send(html);
    })
    .catch((err) => console.log("ERRORCITOS -->", err));
});
