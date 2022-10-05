import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { Conf } from "../core/conf";
import { Util } from "../libs/util";
import { MousePointer } from "../core/mousePointer";
import { Item } from './item';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<Item> = [];

  constructor(opt: any) {
    super(opt);

    // ライト
    const light = new DirectionalLight(Util.instance.randomArr(Conf.instance.COLOR), 1);
    this.mainScene.add(light)
    light.position.set(100, 100, 100);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    for(let i = 0; i < Conf.instance.ITEM_NUM; i++) {
      const item = new Item({
        id:i,
      })
      this._con.add(item);
      this._item.push(item);
    }

    this._resize()
  }


  protected _update(): void {
    super._update()

    const sw = Func.instance.sw();
    // const sh = Func.instance.sh();

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    let itemSizeOld = sw * 0.5 * Util.instance.map(my, 0.5, 1.5, -1, 1);
    let itemSize = itemSizeOld;
    this._item.forEach((val) => {
      val.itemSize.set(itemSize, itemSize, 1);
      // val.position.z = i;
      // val.position.x = itemSizeOld * 0.5;
      // val.position.y = itemSizeOld * 0.5;

      // if(i != 0) {
      //   val.position.x = itemSizeOld * 0.5;
      //   val.position.y = itemSizeOld * 0.5;
      // }

      itemSizeOld = itemSize;
      itemSize *= Util.instance.map(mx, 0.25, 0.95, -1, 1);

      val.blockSize.x = itemSizeOld - itemSize;
    });

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
