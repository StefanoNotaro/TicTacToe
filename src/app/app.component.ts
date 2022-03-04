import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TicTacToe';
  private renderer: Renderer2;

  constructor(public rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'custom-body');
  }
}
