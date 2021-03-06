import {
  Mesh,
  PlaneBufferGeometry,
  PlaneGeometry
} from 'three';

import {PlaneMesh, ClothMesh} from '../../physics/index.js';

import {Component} from '../../core/Component';
import {MeshComponent} from '../../core/MeshComponent';
import {PhysicsComponent} from '../../core/PhysicsComponent';
import {SoftbodyComponent} from '../../core/SoftbodyComponent';
import {loadMaterial} from '../../utils/index';

@SoftbodyComponent
@PhysicsComponent
@MeshComponent
class Plane extends Component {
  static defaults = {
    ...Component.defaults,
    geometry: {
      width: 10,
      height: 10,
      wSegments: 32,
      hSegments: 32
    }
  };

  static instructions = {
    ...Component.instructions,
    geometry: ['width', 'height', 'wSegments', 'hSegments']
  };

  constructor(params = {}) {
    super(params, Plane.defaults, Plane.instructions);

    if (params.build) {
      this.build(params);
      super.wrap();
    }
  }

  build(params = {}) {
    const material = loadMaterial(params.material);

    let MeshNative;

    if (this.physics && this.params.softbody) MeshNative = ClothMesh;
    else if (this.physics) MeshNative = PlaneMesh;
    else MeshNative = Mesh;

    return new Promise((resolve) => {
      this.native = new MeshNative(
        this.buildGeometry(params),
        material,
        this.params
      );

      resolve();
    });
  }

  buildGeometry(params = {}) {
    const GConstruct = params.buffer || params.softbody ? PlaneBufferGeometry : PlaneGeometry;

    const geometry = new GConstruct(
      params.geometry.width,
      params.geometry.height,
      params.geometry.wSegments,
      params.geometry.hSegments
    );

    if (params.softbody) this.proccessSoftbodyGeometry(geometry);

    return geometry;
  }

  set g_width(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {width: val}}));
  }

  get g_width() {
    return this._native.geometry.parameters.width;
  }

  set g_height(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {height: val}}));
  }

  get g_height() {
    return this._native.geometry.parameters.height;
  }

  set g_segments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {segments: val}}));
  }

  get g_segments() {
    return this._native.geometry.parameters.segments;
  }

  clone() {
    return new Plane({build: false}).copy(this);
  }
}

export {
  Plane
};
