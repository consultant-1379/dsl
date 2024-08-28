import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/_services/backend/backend.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  version = '';

  constructor(
    private backendService: BackendService,
  ) { }

  ngOnInit() {
    this.getDslVersion();
  }

  getDslVersion() {
    this.backendService.getInfo().subscribe(
      (data) => {

        this.version = data[1];
      },
      (error) => {
        console.log(`There was a problem getting the version info`);
      },
    );
  }

}
