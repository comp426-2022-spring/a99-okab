import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Table from './Table';
import React, { useEffect , useState } from 'react';

function Dashboard() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const[countryInfo, setCountryInfo] = useState({});

  const[tableData, setTableData] = useState([]);
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  document.title = "Okab COVID-19 Dashboard | Dashboard";
  document.body.style = 'background: rgb(35, 35, 35);';

  useEffect(() => {
    
      const getCountriesData = async () => {
        await fetch('https://disease.sh/v3/covid-19/countries')
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => (
              {
                name: country.country,
                value: country.countryInfo.iso2
              }
            ));
            // setTableData(data);
            setCountries(countries);
          });
      };
      getCountriesData();
    }, [])

    const onCountryChange = async (event) => {
      const countryCode = event.target.value;
      setCountry(countryCode);
  
      const url = countryCode === `worldwide` ? `https://disease.sh/v3/covid-19/all` :
        `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  
  
        await fetch(url)
        .then(response => response.json())
        .then(data => {
          setCountry(countryCode);
          setCountryInfo(data);
        })
    }

    return (
        <div className="app__left">

          <div className="app__header">
            <h1 className='app__header'>Okab COVID-19 Dashboard</h1>
            <FormControl className='="app__dropdown'>
              <Select variant="outlined" onChange={onCountryChange} value={country}>

                <MenuItem value="worldwide">Worldwide</MenuItem>

                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}

              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases}   total={countryInfo.cases} />
            <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} /> 
          </div>
          <Card className="app__right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              {/* <Table countries={tableData}*/}
              <h3>Worldwide New Cases</h3>
            </CardContent>
          </Card>

        </div>
    );
}

export default Dashboard;