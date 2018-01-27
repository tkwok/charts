import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  // column data points and initial values
   first: any[] = [
    {
      'name': 'Enrolled',
      'value': 0
    },
    {
      'name': 'Enrolled African',
      'value': 0
    },
    {
      'name': 'Tested African',
      'value': 0
    }
  ];

  dataSelected: any[];

  public topSchools: any = {
    countries: null,
    districts: null,
    schools: null
  };

  showChart: boolean;

  public getSchool: any;

  selectedValue: any = {};
  selectedCounty: any = null;
  selectedDistrict: any = null;
  selectedSchools: any = null;

  loaded: boolean;

  barChartOptions: any = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    xAxisLabel: 'Data Points',
    showYAxisLabel: true,
    yAxisLabel: 'Number',
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C']
    }
  };

  constructor(private http: Http) {
      this.dataSelected = this.first;
      this.load().then(data => {
        this.topSchools = data || null;
      });
  }

  getObjects(obj, key, val) {
    let objects = [];
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) { continue; }
        if (typeof obj[i] === 'object') {
            objects = objects.concat(this.getObjects(obj[i], key, val));
        } else
        if (i === key && obj[i] === val || i === key && val === '') {
            objects.push(obj);
        } else if (obj[i] === val && key === '') {
            if (objects.lastIndexOf(obj) === -1) {
                objects.push(obj);
            }
        }
    }
    return objects;
  }

  compareFunction(item1, item2): boolean {
    return item1.id === 'alameda';
  }

  compareDistrictFunction(item1, item2): boolean {
    return item1.id === 'fremont-unified';
  }

  compareSchoolFunction(item1, item2): boolean {
    return true;
  }

  onCountyChange(selectedItem: any) {
    const getList: any = this.getObjects(this.topSchools, 'id', selectedItem.id);


    this.selectedCounty = getList[0].districts;
    this.isShowChart();
  }

  onDistrictChange(selectedItem: any) {
    this.selectedSchools = selectedItem.schools || null;
    this.isShowChart();
  }

  onSchoolChange(selectedItem: any) {
    this.loaded = false;
    this.getSchool = this.getObjects(this.topSchools, 'label', selectedItem) || null;
    this.isShowChart();

    this.dataSelected[0]['value'] = this.getSchool[0].elaData.numEnrolled || 0;
    this.dataSelected[1]['value'] = this.getSchool[0].elaData.numEnrolledAfrican || 0;
    this.dataSelected[2]['value'] = this.getSchool[0].elaData.numTestedAfrican || 0;

    this.dataSelected = [...this.dataSelected];
    this.loaded = true;
  }

  isShowChart() {
    this.showChart = this.selectedCounty && this.selectedDistrict && this.selectedSchools; 
  }

  load() {
    return new Promise(resolve => {
      this.http.get('../assets/data/barchart.json')
       .map(res => res.json())
       .subscribe(data => {
          resolve(data);
       });
    });
  }
}
