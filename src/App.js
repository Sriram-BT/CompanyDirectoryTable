import './App.css';
import CompanyTable from './components/companyTable/CompanyTable';
import Header from './components/header/Header';


function App() {
  return (
    <div className="App">
      <Header></Header>
         <div className="company-table-container">
        <CompanyTable />
      </div>
    </div>
  );
}

export default App;