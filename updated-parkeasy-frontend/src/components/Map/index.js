import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import style from "./map.module.scss";
import geoJson from "../../canadaparkks.json";
import { rateParkingLot, bookParkingLot, registerLots } from "../../api";
mapboxgl.accessToken =
  "pk.eyJ1IjoidGh0aGVjb2RlciIsImEiOiJjbGdjZWY5cDAxaThhM2RvNjlwcWRic3R5In0.DuB7Z9ciu3iMT1QDUw7XYw";

function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const calgary = [-114.0917281, 51.0381918];
    geoJson.features.forEach(async (store, i) => {
      i = i + 1;
      store.properties.id = i;
      store.geometry.type = "Point";
      if (typeof store.geometry.coordinates[0] !== "number") {
        store.geometry.coordinates = [
          store.geometry.coordinates[0][0][0],
          store.geometry.coordinates[0][0][1],
        ];
      }
      if (
        store.properties.price_zone === null ||
        isNaN(store.properties.price_zone)
      ) {
        store.properties.price_zone = "10";
      }
      if (store.properties.brz_name === null) {
        store.properties.brz_name = "Street";
      }
      if (!store.properties.brz_name.includes("-")) {
        store.properties.brz_name +=
          "-" +
          store.properties.parking_zone +
          "-" +
          store.properties.block_side;
      }

      // registerLots({
      //   name: store.properties.brz_name,
      //   price: Number(store.properties.price_zone),
      // });
    });
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: calgary,
      zoom: 10,
    });

    map.on("load", () => {
      buildLocationList(geoJson);

      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
          map.addSource("places", {
            type: "geojson",
            data: geoJson,
          });

          map.addLayer({
            id: "points",
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": "custom-marker",
              "text-field": ["get", "brz_name"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },

        trackUserLocation: true,

        showUserHeading: true,
      })
    );
    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    const { MapboxDirections } = window;

    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/cycling",
      }),

      "top-right"
    );
    function flyToStore(currentFeature) {
      map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15,
      });
    }

    function createPopUp(currentFeature) {
      const popUps = document.getElementsByClassName("mapboxgl-popup");

      if (popUps[0]) popUps[0].remove();

      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
          `<h3>${currentFeature.properties.address_desc}</h3><h4>${
            currentFeature.properties.brz_name === null
              ? `Street ${currentFeature.properties.id + 1}`
              : currentFeature.properties.brz_name
          }</h4>`
        )
        .addTo(map);
    }

    map.on("click", (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["points"],
      });

      if (!features.length) return;

      const clickedPoint = features[0];

      flyToStore(clickedPoint);

      createPopUp(clickedPoint);

      const activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      const listing = document.getElementById(
        `listing-${clickedPoint.properties.id}`
      );
      listing.classList.add("active");
    });

    async function buildLocationList(stores) {
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
      }

      const locations = [];
      for (const store of geoJson.features) {
        locations.push(store.geometry.coordinates);
      }

      let closestLocation = null;
      let closestDistance = Infinity;
      const tl = JSON.parse(localStorage.getItem("myLocation"));

      const targetLocation = [tl.lon, tl.lat];

      for (let i = 0; i < locations.length; i++) {
        const distance = getDistanceFromLatLonInKm(
          targetLocation[1],
          targetLocation[0],
          locations[i][1],
          locations[i][0]
        );
        if (distance < closestDistance) {
          closestLocation = locations[i];
          closestDistance = distance;
        }
      }

      const storeList = [];
      for (const store of geoJson.features) {
        if (store.geometry.coordinates === closestLocation) {
          storeList.push(store);
        }
      }

      const store = storeList[0];
      if (store.geometry.coordinates === closestLocation) {
        const listings = document.getElementById("closestPark");

        const link = document.getElementById("a-title");

        link.innerHTML = `${store.properties.brz_name}`;

        const info = document.getElementById("b-title");
        info.innerHTML = `FEE - $${store.properties.price_zone}`;

        const info2 = document.getElementById("c-title");
        info2.innerHTML = `${store.properties.address_desc}`;

        const idEl = document.getElementById("fav-id");
        idEl.innerHTML = store.properties.id;

        listings.addEventListener("click", function () {
          flyToStore(store);
          createPopUp(store);

          const activeItem = document.getElementsByClassName("active");
          if (activeItem[0]) {
            activeItem[0].classList.remove("active");
          }
          this.parentNode.classList.add("active");
        });
      }

      for (const store of stores.features) {
        const listings = document.getElementById("listings");
        const listing = listings.appendChild(document.createElement("div"));
        listing.id = `listing-${store.properties.id}`;
        listing.className = "item";

        const button = listing.appendChild(document.createElement("button"));
        button.innerHTML = "Book";

        button.addEventListener("click", async () => {
          console.log("clicked => id", store.properties.id);
          const res = await bookParkingLot(store.properties.id);
          if (res.status === 201) {
            alert(`${store.properties.brz_name} Booked successfully`);
          }
        });

        const rating = listing.appendChild(document.createElement("i"));
        rating.className = "fa fa-star";
        rating.addEventListener("click", async () => {
          console.log("clicked => id", store.properties.id);
          if (rating.className === "fa fa-star") {
            rating.className = "fa fa-star checked";
            rating2.className = "fa fa-star ";
            rating3.className = "fa fa-star ";
            rating4.className = "fa fa-star ";
            rating5.className = "fa fa-star";
            const res = await rateParkingLot({
              parkinglot: store.properties.id,
              noOfStars: 1,
            });
            if (res.status === 201) {
              alert(`${store.properties.brz_name} Rated One Star`);
            }
          } else {
            rating.className = "fa fa-star";
            rating2.className = "fa fa-star";
            rating3.className = "fa fa-star";
            rating4.className = "fa fa-star";
            rating5.className = "fa fa-star";
          }
          // const res = await bookParkingLot(store.properties.id);
          // if (res.status === 201) {
          //   alert(`${store.properties.brz_name} Booked successfully`);
          // }
        });

        const rating2 = listing.appendChild(document.createElement("i"));
        rating2.className = "fa fa-star";
        rating2.addEventListener("click", async () => {
          console.log("clicked => id", store.properties.id);
          if (rating2.className === "fa fa-star") {
            rating.className = "fa fa-star checked";
            rating2.className = "fa fa-star checked";
            rating3.className = "fa fa-star ";
            rating4.className = "fa fa-star ";
            rating5.className = "fa fa-star";
            const res = await rateParkingLot({
              parkinglot: store.properties.id,
              noOfStars: 2,
            });
            if (res.status === 201) {
              alert(`${store.properties.brz_name} Rated Two Stars`);
            }
          } else {
            rating.className = "fa fa-star";
            rating2.className = "fa fa-star";
            rating3.className = "fa fa-star";
            rating4.className = "fa fa-star";
            rating5.className = "fa fa-star";
          }
          // const res = await bookParkingLot(store.properties.id);
          // if (res.status === 201) {
          //   alert(`${store.properties.brz_name} Booked successfully`);
          // }
        });
        const rating3 = listing.appendChild(document.createElement("i"));
        rating3.className = "fa fa-star";
        rating3.addEventListener("click", async () => {
          console.log("clicked => id", store.properties.id);
          if (rating3.className === "fa fa-star") {
            rating.className = "fa fa-star checked";
            rating2.className = "fa fa-star checked";
            rating3.className = "fa fa-star checked";
            rating4.className = "fa fa-star ";
            rating5.className = "fa fa-star";
            const res = await rateParkingLot({
              parkinglot: store.properties.id,
              noOfStars: 3,
            });
            if (res.status === 201) {
              alert(`${store.properties.brz_name} Rated Three Star`);
            }
          } else {
            rating.className = "fa fa-star";
            rating2.className = "fa fa-star";
            rating3.className = "fa fa-star";
            rating4.className = "fa fa-star";
            rating5.className = "fa fa-star";
          }
          // const res = await bookParkingLot(store.properties.id);
          // if (res.status === 201) {
          //   alert(`${store.properties.brz_name} Booked successfully`);
          // }
        });
        const rating4 = listing.appendChild(document.createElement("i"));
        rating4.className = "fa fa-star";
        rating4.addEventListener("click", async () => {
          console.log("clicked => id", store.properties.id);
          if (rating4.className === "fa fa-star") {
            rating.className = "fa fa-star checked";
            rating2.className = "fa fa-star checked";
            rating3.className = "fa fa-star checked";
            rating4.className = "fa fa-star checked";
            rating5.className = "fa fa-star";
            const res = await rateParkingLot({
              parkinglot: store.properties.id,
              noOfStars: 4,
            });
            if (res.status === 201) {
              alert(`${store.properties.brz_name} Rated Four Stars`);
            }
          } else {
            rating.className = "fa fa-star";
            rating2.className = "fa fa-star";
            rating3.className = "fa fa-star";
            rating4.className = "fa fa-star";
            rating5.className = "fa fa-star";
          }
          // const res = await bookParkingLot(store.properties.id);
          // if (res.status === 201) {
          //   alert(`${store.properties.brz_name} Booked successfully`);
          // }
        });
        const rating5 = listing.appendChild(document.createElement("i"));
        rating5.className = "fa fa-star";

        rating5.addEventListener("click", async () => {
          console.log("clicked => id", store.properties.id);
          if (rating5.className === "fa fa-star") {
            rating.className = "fa fa-star checked";
            rating2.className = "fa fa-star checked";
            rating3.className = "fa fa-star checked";
            rating4.className = "fa fa-star checked";
            rating5.className = "fa fa-star checked";
            const res = await rateParkingLot({
              parkinglot: store.properties.id,
              noOfStars: 5,
            });
            if (res.status === 201) {
              alert(`${store.properties.brz_name} Rated Five Stars`);
            }
          } else {
            rating.className = "fa fa-star";
            rating2.className = "fa fa-star";
            rating3.className = "fa fa-star";
            rating4.className = "fa fa-star";
            rating5.className = "fa fa-star";
          }
          // const res = await bookParkingLot(store.properties.id);
          // if (res.status === 201) {
          //   alert(`${store.properties.brz_name} Booked successfully`);
          // }
        });

        const link = listing.appendChild(document.createElement("a"));
        link.href = "#";
        link.className = "title";
        link.id = `link-${store.properties.id}`;

        link.innerHTML = `${store.properties.brz_name}`;

        const info = listing.appendChild(document.createElement("a"));
        info.className = "title";
        info.id = `link-${store.properties.id}`;
        info.innerHTML = `FEE - $${store.properties.price_zone}`;

        link.addEventListener("click", function () {
          for (const feature of stores.features) {
            if (this.id === `link-${feature.properties.id}`) {
              flyToStore(feature);
              createPopUp(feature);
            }
          }
          const activeItem = document.getElementsByClassName("active");
          if (activeItem[0]) {
            activeItem[0].classList.remove("active");
          }
          this.parentNode.classList.add("active");
        });
      }
    }

    return () => map.remove();
  }, []);

  return <div className={style.mapcontainer} ref={mapContainerRef} />;
}

export default Map;
