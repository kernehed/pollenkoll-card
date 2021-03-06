customElements.whenDefined('card-tools').then(() => {
  let cardTools = customElements.get('card-tools');
  class PollenKollCard  extends cardTools.LitElement {
  
    setConfig(config) {
      if (!config.allergens) {
        throw new Error('Please define allergens (list)');
      }
      if (!config.city) {
        throw new Error('Please define city');
      }
      this.config = config;
    }
  
    render(){
      return cardTools.LitHtml
      `
      ${this.config.minimal == false || this.config.minimal == null
        ? this._renderStyle()
        : this._renderMinimalStyle()}
      ${this.config.minimal == false || this.config.minimal == null
        ? this._renderCard()
        : this._renderMinimalCard()}
  
      `
    }
  
    _renderMinimalCard(){
      return cardTools.LitHtml
      `
      <ha-card>
        ${this.config.title == null || this.config.title == true ?
        cardTools.LitHtml`
        <div class="header">
          <div class="name">
          ${this.header}
          </div>
        </div>`
        : ""
      }
        <div class="container">
          ${this.sensors.map(sensor => cardTools.LitHtml`
          <div class="sensor">
            <p class="box">${sensor.allergen_locale}</p>
            <img class="box" src="/local/pollen_img/${sensor.allergens.toLowerCase()}_${sensor.day1.state == "unknown" || sensor.day1.state == "i.u." ? 0 : sensor.day1.state}.svg"/>
            ${this.config.show_state == true || this.config.show_state == null
              ? cardTools.LitHtml`<p class="box">${sensor.day1.state == "unknown" || sensor.day1.state == "i.u." ? sensor.day1.state : sensor.day1.attributes.description}</p>`
              : ""}
          </div>
        `)}
        </div>
      </ha-card>
      `
    }
  
    _renderMinimalStyle() {
      return cardTools.LitHtml
      `
      <style>
      ha-card {
        padding: 16px;
      }
      .header {
        padding: 0;
        @apply --paper-font-headline;
        line-height: 40px;
        color: var(--primary-text-color);
        padding: 4px 0 12px;
      }
      .forecast {
        width: 100%;
        padding: 7px;
        height: 100%;
      }
      td {
        padding: 3px;
        text-align: center;
      }
      .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        text-align: center;
        justify-content: space-evenly;
        align-items: center;
      }
      .sensor {
        margin: 10px;
        flex: 1 1 0;
        flex-direction: column;
        justify-content: space-evenly;
        display: flex;
        align-self: flex-start;
      }
      @supports not (-ms-flex: 1) {
        .container {
          height: auto; /* 2 */
          min-height: 24em; /* 2 */
        }
      }
      img {
        max-height: 50px;
      }
      .sensor {
        display: block;
        min-width: 16.66%;
        flex: 1;
      }
     </style>`
    }
  
    _renderCard(){
      return cardTools.LitHtml
      `
      <ha-card>
      ${this.config.title == null || this.config.title == true ?
        cardTools.LitHtml`
        <div class="header">
          <div class="name">
          ${this.header}
          </div>
        </div>`
        : ""
      }
      <table class="forecast">
          <thead>
            <th>Pollen</th>
            <th>Idag</th>
            <th>Imorgon</th>
            <th>${this.sensors[0].day3.state == "unknown" ? "I övermorgon" : this.sensors[0].day3.attributes.day}</th>
          </thead>
          ${this.sensors.map(sensor => cardTools.LitHtml`
              <tr class="allergen">
                <td><img class="allergen" src="/local/pollen_img/${sensor.allergens.toLowerCase()}_${sensor.day1.state == "unknown" || sensor.day1.state == "i.u." ? 0 : sensor.day1.state}.svg"/><p>${sensor.allergen_locale}</p></td>
                ${sensor.day1.state == "unknown" || sensor.day1.state == "i.u." ? cardTools.LitHtml`<td>${sensor.day1.state}</td>` :
                cardTools.LitHtml`<td>
                  <img src="/local/pollen_img/${sensor.day1.state + ".svg"}"/>
                  ${this.config.show_state == true || this.config.show_state == null ? cardTools.LitHtml`<p class="state-text">${sensor.day1.attributes.description} </p>`: ""}
                  </td>`
        }
                ${sensor.day2.state == "unknown" || sensor.day2.state == "i.u." ? cardTools.LitHtml`<td>${sensor.day2.state}</td>` :
                cardTools.LitHtml`<td>
                  <img src="/local/pollen_img/${sensor.day2.state + ".svg"}"/>
                  ${this.config.show_state == true || this.config.show_state == null ? cardTools.LitHtml`<p class="state-text">${sensor.day2.attributes.description} </p>`: ""}
                  </td>`
        }
                ${sensor.day3.state == "unknown" || sensor.day3.state == "i.u." ? cardTools.LitHtml`<td>${sensor.day3.state}</td>` :
                cardTools.LitHtml`<td>
                  <img src="/local/pollen_img/${sensor.day3.state + ".svg"}"/>
                  ${this.config.show_state == true || this.config.show_state == null ? cardTools.LitHtml`<p class="state-text">${sensor.day3.attributes.description} </p>`: ""}
                  </td>`
        }
              </tr>`)}
              </div>
              </div>
              </ha-card>`
    }
  
    _renderStyle() {
      return cardTools.LitHtml
      `<style>
        ha-card {
          padding: 16px;
        }
        .header {
          padding: 0;
          @apply --paper-font-headline;
          line-height: 40px;
          color: var(--primary-text-color);
          padding: 4px 0 12px;
        }
        .forecast {
          width: 100%;
          padding: 7px;
          height: 100%;
        }
        td {
          padding: 3px;
          text-align: center;
          width: 100px;
        }
        img {
          width: 100px;
        }
        img.allergen {
          width: 50px;
          height: 50px;
        }
        ${this.config.compact == true ?
          cardTools.LitHtml
          `
          img {
            width: 50px;
            height: 50px;
          }
          p {
            margin-top: 3px;
          }
          td {
            width: 100px;
          }
          `
        : ``
      }
      </style>
      `
    }
    set hass(hass) {
      this._hass = hass;
      var sensors = [];
  
      if (this.config.title == null || this.config.title == true) {
        var header_city = this.config.city
        this.header = `Pollenprognos ${header_city.charAt(0).toUpperCase() + header_city.slice(1)}`;
      }
  
      const cityConf = this.config.city.toLowerCase();
      var cityReplace1 = cityConf.replace('å', 'a')
      var cityReplace2 = cityReplace1.replace('ä', 'a')
      var city = cityReplace2.replace('ö', 'o')
  
      const allergens = this.config.allergens;
      for (var i = 0; i < allergens.length; i++) {
        var dict = {};
        dict.allergen_locale = (allergens[i].charAt(0).toUpperCase() + allergens[i].slice(1));
        var allergen = allergens[i].replace(' / ', '_').toLowerCase();
  
        var allergenReplace = allergen.replace('å', 'a')
        var allergenReplace2 = allergenReplace.replace('ä', 'a')
        var allergenReplaced = allergenReplace2.replace('ö', 'o')
  
        dict.allergens = allergenReplaced
        dict.day1 = hass.states[`sensor.pollenniva_${city}_${allergenReplaced}_day_0`],
        dict.day2 = hass.states[`sensor.pollenniva_${city}_${allergenReplaced}_day_1`],
        dict.day3 = hass.states[`sensor.pollenniva_${city}_${allergenReplaced}_day_2`]
  
        sensors.push(dict)
      }
  
      for (let i = 0; i < sensors.length; i++) {
        const element = sensors[i];
        if (element.day1.state == "unknown" || element.day2.state == "unknown" || element.day3.state == "unknown") {
          var log_text = `A sensor for "${element.allergen_locale}" is returning unknown, you should probably check your config for that sensor in the custom component.`;
          console.log(log_text)
        }
      }
  
      this.sensors = sensors;
      this.requestUpdate();
    }
  
  
  
    // @TODO: This requires more intelligent logic
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define('pollenkoll-card', PollenKollCard);
  });
  
  window.setTimeout(() => {
    if(customElements.get('card-tools')) return;
    customElements.define('pollenkoll-card', class extends HTMLElement{
      setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
    });
  }, 2000);