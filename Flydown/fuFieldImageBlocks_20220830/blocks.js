// -*- mode: java; c-basic-offset: 2; -*-
// Copyright © 2013-2016 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Flydown is an abstract class for a flyout-like dropdown containing blocks.
 *   Unlike a regular flyout, for simplicity it does not support scrolling.
 *   Any non-abstract subclass must provide a flydownBlocksXML_ () method that returns an
 *   XML element whose children are blocks that should appear in the flyout.
 * @author fturbak@wellesley.edu (Lyn Turbak)
 * https://github.com/mit-cml/appinventor-sources/blob/master/appinventor/blocklyeditor/src/flydown.js
 */
 
 /**
 * @license
 * Copyright 2022 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blocks Flydown.
 * @author https://www.facebook.com/francefu/
 * @Update 8/30/2022 00:00 (Taiwan Standard Time)
 */

/*
Blockly.Blocks["test"] = {
	init:  function() {
		this.field = {};
		var fieldImageName1 = "imageName1";
		const icon1 = "data:image/png;base64,.........";
		var blocksXML1 = ['<block type="controls_if"><value name="IF0"></value></block>','<block type="logic_compare"><field name="OP">EQ</field></block>'];
		
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage(icon1, 18, 18, { alt: "*", flipRtl: "FALSE" }), fieldImageName1);
		this.field[fieldImageName1] = new myFieldImageBlocks.eventparam(this.getField(fieldImageName1), blocksXML1);
		
		var fieldImageName2 = "imageName2";
		const icon2 = "data:image/png;base64,.........";
		var blocksXML2 = ['<block type="variables_get"><field name="VAR">i</field></block>','<block type="math_number"><field name="NUM">0</field></block>'];
		
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage(icon2, 18, 18, { alt: "*", flipRtl: "FALSE" }), fieldImageName2);
		this.field[fieldImageName2] = new myFieldImageBlocks.eventparam(this.getField(fieldImageName2), blocksXML2);
		
		//etc...
	}
}
*/




document.addEventListener('DOMContentLoaded', function() {
	
	Blockly.Flyout.prototype.updateDisplay_=function(){
		var a=this.containerVisible_?this.isVisible():!1;
		this.svgGroup_.style.display=a?"block":"none";
		if (this.workspace_.scrollbar)
			this.workspace_.scrollbar.setContainerVisible(a)
	};

	Blockly.Flyout.prototype.clearOldBlocks_=function(){
		for(var a=this.workspace_.getTopBlocks(!1),b=0,c;c=a[b];b++)
			this.blockIsRecyclable_(c)?this.recycleBlock_(c):c.dispose(!1,!1);
		for(a=0;a<this.mats_.length;a++)
			if(b=this.mats_[a])(0,Blockly.Tooltip.unbindMouseEvents)(b),(0,Blockly.utils.dom.removeNode)(b);
		for(a=this.mats_.length=0;b=this.buttons_[a];a++)
			b.dispose();
		this.buttons_.length=0;
		if (this.workspace_.getPotentialVariableMap())
			this.workspace_.getPotentialVariableMap().clear()
	};

	
	
	
	

	Blockly.fuFieldImageBlocks = function(workspaceOptions) {
	  Blockly.fuFieldImageBlocks.superClass_.constructor.call(this, workspaceOptions);
	};
	Blockly.utils.object.inherits(Blockly.fuFieldImageBlocks, Blockly.VerticalFlyout);

	/**
	 * Previous CSS class for this flydown
	 * @type {number}
	 * @const
	 */
	Blockly.fuFieldImageBlocks.prototype.previousCSSClassName_ = '';

	/**
	 * Override flyout factor to be smaller for flydowns
	 * @type {number}
	 * @const
	 */
	Blockly.fuFieldImageBlocks.prototype.VERTICAL_SEPARATION_FACTOR = 1;

	/**
	 * Creates the flydown's DOM.  Only needs to be called once.  Overrides the flyout createDom method.
	 * @param {!String} cssClassName The name of the CSS class for this flydown. 
	 * @return {!Element} The flydown's SVG group.
	 */
	Blockly.fuFieldImageBlocks.prototype.createDom = function(cssClassName, backgroundCOLOR) {
	  /*
	  <g>
		<path class={cssClassName}/>
		<g></g>
	  </g>
	  */
	  this.previousCSSClassName_ = cssClassName; // Remember class name for later
	  this.svgGroup_ = Blockly.utils.dom.createSvgElement('g', {'class': cssClassName}, null);
	  this.svgBackground_ = Blockly.utils.dom.createSvgElement('path', {
		'stroke': backgroundCOLOR,
		'fill': backgroundCOLOR}, this.svgGroup_);
	  this.svgGroup_.appendChild(this.workspace_.createDom());
	  return this.svgGroup_;
	};

	/**
	 * Set the CSS class of the flydown SVG group. Need to remove previous class if there is one.
	 * @param {!String} newCSSClassName The name of the new CSS class replacing the old one
	 */
	Blockly.fuFieldImageBlocks.prototype.setCSSClass = function(newCSSClassName) {
	  if (newCSSClassName !== this.previousCSSClassName_) {
		Blockly.utils.dom.removeClass(this.svgGroup_, this.previousCSSClassName_);
		Blockly.utils.dom.addClass(this.svgGroup_, newCSSClassName);
		this.previousCSSClassName_ = newCSSClassName;
	  }
	}

	/**
	 * Initializes the Flydown.
	 * @param {!Blockly.Workspace} workspace The workspace in which to create new
	 *     blocks.
	 */
	Blockly.fuFieldImageBlocks.prototype.init = function(workspace) {
	  Blockly.VerticalFlyout.prototype.init.call(this, workspace, false); // Flydowns have no scrollbar
	}

	/**
	 * Override the flyout position method to do nothing instead
	 * @private
	 */
	Blockly.fuFieldImageBlocks.prototype.position = function() {
	  return;
	}

	/**
	 * Show and populate the flydown.
	 * @param {!Array|string} xmlList List of blocks to show.
	 * @param {!num} x x-position of upper-left corner of flydown
	 * @param {!num} y y-position of upper-left corner of flydown
	 */
	Blockly.fuFieldImageBlocks.prototype.showAt = function(xmlList,x,y) {
	  Blockly.Events.disable();
	  try {
		this.show(xmlList); // invoke flyout method, which adds blocks to flydown and calculates width and height.
	  } finally {
		Blockly.Events.enable();
	  }
	  // this.svgGroup_.setAttribute('transform', 'translate(' + x + ',' + y + ')');
	  // Calculate path around flydown blocks. Based on code in flyout position_ method.

	  // Start at bottom of top left arc and proceed clockwise
	  // Flydown outline shape is symmetric about vertical axis, so no need to differentiate LTR and RTL paths.
	  var margin = this.CORNER_RADIUS * this.workspace_.scale;
	  var edgeWidth = this.width_ - 2*margin;
	  var edgeHeight = this.height_ - 2*margin;


	  var path = ['M 0,' + margin];
	  path.push('a', margin, margin, 0, 0, 1, margin, -margin); // upper left arc
	  path.push('h', edgeWidth);  // top edge
	  path.push('a', margin, margin, 0, 0, 1, margin, margin); // upper right arc
	  path.push('v', edgeHeight); // right edge
	  path.push('a', margin, margin, 0, 0, 1, -margin, margin); // bottom right arc
	  path.push('h', -edgeWidth); // bottom edge, drawn backwards
	  path.push('a', margin, margin, 0, 0, 1, -margin, -margin); // bottom left arc
	  path.push('z'); // complete path by drawing left edge
	  this.svgBackground_.setAttribute('d', path.join(' '));
	  this.svgGroup_.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
	}

	/**
	 * Compute width and height of Flydown.  Position button under each block.
	 * Overrides the reflow method of flyout
	 * For RTL: Lay out the blocks right-aligned.
	 */
	Blockly.fuFieldImageBlocks.prototype.reflow = function() {
	  this.workspace_.scale = this.targetWorkspace_.scale;
	  var scale = this.workspace_.scale;
	  var flydownWidth = 0;
	  var flydownHeight = 0;
	  var margin = this.CORNER_RADIUS * scale;
	  var blocks = this.workspace_.getTopBlocks(false);
	  for (var i = 0, block; block = blocks[i]; i++) {
		var root = block.getSvgRoot();
		var blockHW = block.getHeightWidth();
		flydownWidth = Math.max(flydownWidth, blockHW.width * scale);
		flydownHeight += blockHW.height * scale * 1.3;
	  }
	  
	  var constantes = this.targetWorkspace_.getRenderer().getConstants();

	  flydownWidth += 2 * margin + constantes.TAB_WIDTH * scale; // TAB_WIDTH is with of plug
	  flydownHeight += 2 * margin + margin * this.VERTICAL_SEPARATION_FACTOR * (blocks.length - 1) + constantes.START_HAT_HEIGHT*scale/2.0;


	  if (this.width_ != flydownWidth) {
		for (var j = 0, block; block = blocks[j]; j++) {
		  var blockHW = block.getHeightWidth();
		  var blockXY = block.getRelativeToSurfaceXY();
		  if (this.RTL) {
			// With the FlydownWidth known, right-align the blocks.
			var dx = flydownWidth - margin - scale * (constantes.TAB_WIDTH - blockXY.x);
			block.moveBy(dx, 0);
			blockXY.x += dx;
		  }
		  if (block.flyoutRect_) {
			block.flyoutRect_.setAttribute('width', blockHW.width);
			block.flyoutRect_.setAttribute('height', blockHW.height);
			block.flyoutRect_.setAttribute('x',
				this.RTL ? blockXY.x - blockHW.width : blockXY.x);
			block.flyoutRect_.setAttribute('y', blockXY.y);
		  }
		}
		// Record the width for us in showAt method

		this.width_ = flydownWidth;
		this.height_ = flydownHeight;
	  }
	};

	Blockly.fuFieldImageBlocks.prototype.onMouseMove_ = function(e) {
	  // override Blockly's flyout behavior for moving the flyout.
	  return;
	};

	Blockly.fuFieldImageBlocks.prototype.getX = function () {
	  return 0;
	};

	/**
	 * Copy a block from the flyout to the workspace and position it correctly.
	 * @param {!Blockly.Block} originBlock The flyout block to copy..
	 * @return {!Blockly.Block} The new block in the main workspace.
	 * @private
	 */
	Blockly.fuFieldImageBlocks.prototype.placeNewBlock_ = function(originBlock) {
	  var targetWorkspace = this.targetWorkspace_;
	  var svgRootOld = originBlock.getSvgRoot();
	  if (!svgRootOld) {
		throw 'originBlock is not rendered.';
	  }
	  // Figure out where the original block is on the screen, relative to the upper
	  // left corner of the main workspace.
	  var scale = this.workspace_.scale;
	  var margin = this.CORNER_RADIUS * scale;
	  var xyOld = this.workspace_.getSvgXY(svgRootOld);
	  //var scrollX = this.svgGroup_.getScreenCTM().e + margin;
	  var scrollX = xyOld.x;
	  xyOld.x += scrollX / targetWorkspace.scale - scrollX;
	  //var scrollY = this.svgGroup_.getScreenCTM().f + margin;
	  var scrollY = xyOld.y;
	  scale = targetWorkspace.scale;
	  xyOld.y += scrollY / scale - scrollY;

	  // Create the new block by cloning the block in the flyout (via XML).
	  var xml = Blockly.Xml.blockToDom(originBlock);
	  var block = Blockly.Xml.domToBlock(xml, targetWorkspace);
	  var svgRootNew = block.getSvgRoot();
	  if (!svgRootNew) {
		throw 'block is not rendered.';
	  }
	  // Figure out where the new block got placed on the screen, relative to the
	  // upper left corner of the workspace.  This may not be the same as the
	  // original block because the flyout's origin may not be the same as the
	  // main workspace's origin.
	  var xyNew = targetWorkspace.getSvgXY(svgRootNew);
	  // Scale the scroll (getSvgXY did not do this).
	  xyNew.x +=
		  targetWorkspace.scrollX / targetWorkspace.scale - targetWorkspace.scrollX;
	  xyNew.y +=
		  targetWorkspace.scrollY / targetWorkspace.scale - targetWorkspace.scrollY;
	  // If the flyout is collapsible and the workspace can't be scrolled.
	  if (targetWorkspace.toolbox_ && !targetWorkspace.scrollbar) {
		xyNew.x += targetWorkspace.toolbox_.getWidth() / targetWorkspace.scale;
		xyNew.y += targetWorkspace.toolbox_.getHeight() / targetWorkspace.scale;
	  }

	  // Move the new block to where the old block is.
	  block.moveBy(xyOld.x - xyNew.x, xyOld.y - xyNew.y);
	  myFieldImageBlocks.eventparam.isFlydownName = '';
	  return block;
	};

	Blockly.fuFieldImageBlocks.prototype.shouldHide = true;

	Blockly.fuFieldImageBlocks.prototype.hide = function() {
	  if (this.shouldHide) {
		Blockly.VerticalFlyout.prototype.hide.call(this);
		myFieldImageBlocks.eventparam.openFieldFlydown_ = null;
	  }
	  this.shouldHide = true;
	}






	var myFieldImageBlocks = myFieldImageBlocks||{};

	myFieldImageBlocks.eventparam = function (opt_image, opt_blocksXML, opt_validator) {
		this.opt_image_ = opt_image;
		this.opt_image_.setOnClickHandler(myFieldImageBlocks.eventparam.clickHandler_);
		this.displayLocation = myFieldImageBlocks.eventparam.DISPLAY_BELOW;
		this.opt_workspace = opt_image.sourceBlock_.workspace;
		if (opt_blocksXML)
			this.opt_blocksXML_ = '<xml>'+opt_blocksXML.join("")+'</xml>';
		
		myFieldImageBlocks.eventparam.superClass_.constructor.call(this, '', opt_validator);
	};
	Blockly.utils.object.inherits(myFieldImageBlocks.eventparam, Blockly.Field);

	myFieldImageBlocks.eventparam.clickHandler_ = function () {
		const eventparam_ = myFieldImageBlocks.eventparam;
		if (eventparam_.isFlydownName==this.name) {
			eventparam_.hide();
			myFieldImageBlocks.eventparam.isFlydownName = '';
		}
		else {
			this.sourceBlock_.field[this.name].showFlydown_();
			myFieldImageBlocks.eventparam.isFlydownName = this.name;
		}
	}	
	myFieldImageBlocks.eventparam.openFieldFlydown_ = null;
	myFieldImageBlocks.eventparam.DISPLAY_BELOW = "BELOW";
	myFieldImageBlocks.eventparam.DISPLAY_RIGHT = "RIGHT";
	myFieldImageBlocks.eventparam.DISPLAY_LOCATION = myFieldImageBlocks.eventparam.DISPLAY_BELOW;
	myFieldImageBlocks.eventparam.prototype.fieldCSSClassName = 'blocklyFieldFlydownField';
	myFieldImageBlocks.eventparam.prototype.flyoutCSSClassName = 'blocklyFieldFlydownFlydown';
	myFieldImageBlocks.eventparam.isFlydownName = '';

	myFieldImageBlocks.eventparam.prototype.init = function (block) {
		myFieldImageBlocks.eventparam.superClass_.init.call(this, block);
	};

	myFieldImageBlocks.eventparam.prototype.showFlydown_ = function () {
		Blockly.hideChaff();
		var flydown = Blockly.getMainWorkspace().getFlydown();

		// Add flydown to top-level svg, *not* to main workspace svg
		// This is essential for correct positioning of flydown via translation
		// (If it's in workspace svg, it will be additionally translated by
		//  workspace svg translation relative to Blockly.svg.)
		flydown.targetWorkspace = this.opt_workspace;
		flydown.targetWorkspace_ = this.opt_workspace;
		Blockly.getMainWorkspace().getParentSvg().appendChild(flydown.svgGroup_);

		// Adjust scale for current zoom level
		var scale = flydown.targetWorkspace_.scale;
		flydown.workspace_.setScale(scale);
		flydown.setCSSClass(this.flyoutCSSClassName);

		var blocksDom = Blockly.Xml.textToDom(this.opt_blocksXML_);

		// [lyn, 11/10/13] Use goog.dom.getChildren rather than .children or
		//    .childNodes to make this code work across browsers.
		var blocksXMLList = blocksDom.children;

		var xy = Blockly.getMainWorkspace().getSvgXY(this.opt_image_.getSvgRoot());
		xy.y += this.opt_image_.sourceBlock_.height * scale;
		flydown.showAt(blocksXMLList, xy.x, xy.y);
		
		myFieldImageBlocks.eventparam.openFieldFlydown_ = this;
	};

	myFieldImageBlocks.eventparam.hide = function () {
		// Hide any displayed flydown.
		var flydown = Blockly.getMainWorkspace().getFlydown();
		if (flydown) {
			flydown.hide();
		}
	};

	myFieldImageBlocks.eventparam.prototype.dispose = function () {
		  if (myFieldImageBlocks.eventparam.openFieldFlydown_ == this) {
			myFieldImageBlocks.eventparam.hide();
		}
		// Call parent's destructor.
		Blockly.FieldTextInput.prototype.dispose.call(this);
	};






	Blockly.WorkspaceSvg.prototype.fuFieldImageBlocks_ = null;
	Blockly.WorkspaceSvg.prototype.getFlydown = function() {
	  return this.fuFieldImageBlocks_;
	};


	
	var fuFieldImageBlocksTimer = setInterval(function() {

		var workspace = Blockly.getMainWorkspace();
		if (!workspace) 
			return;
		else
			clearInterval(fuFieldImageBlocksTimer);
		
		var flydown = new  Blockly.fuFieldImageBlocks(new Blockly.Options({scrollbars:  true }));
		workspace.fuFieldImageBlocks_ = flydown;
		Blockly.utils.dom.insertAfter(flydown.createDom('g', 'rgba(0, 0, 0, 1)'), workspace.svgBubbleCanvas_);

		Blockly.Blocks["test"] = {
			init:  function() {
				this.field = {};

				var fieldImageName1 = "imageName1";
				const icon1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAABJ0AAASdAHeZh94AAA5LklEQVR4Xu2debSlaVXe95nnO9+6Qw331tjV3UXTNF2gIIgiLONAnBBHgsY4oNE/jGGtRP5IVlxJllGzVFjQEcXEKKIYcWlAcSCCRmho6Ymq7qqu+VbdeTj3zOc75+T37Pc7VdV021QPoMtwep0+557p+97n3e/ez372fr8y+9LtSwj8Y0Ig8Q9pMO2LH0lbr1Xpd5rFqNsoDaJ2pdtplK0XlXr9bm7Q6+fMkgPOuZ9MJjvJRLpt3UEvkc7spjP5aipX3EnmCvVktlDLHfmG6B/S2P7egB5c+JPkoNucbXbq083m7mK9tnOi26qdiDqNA71OY7zfa45Yv1sG7FK/H6Vt0LPBYGCJvnA2SyQSlrRUL51Id/qWqCeS2d1EKreTyuZ30vnSSjpfPJ3M5j6dLVTOZ0ujV8dOvHnj7xP4LzrQ3TPvn29X1w82dza+JmrXXlFv1Y51uo293XY90+91zAZdG1hk6WTPUsm+5bNpSyaActB3nJI3oSXg+7zS6/Ut6vG8l7T+gE8ks5ZMsjgSiUEqnb2YzBY/my6MfDRfmfx4oTJ7fvLuH17+YoP+RQG6dfHDxebWyvFWdfX1nd2V17abG7dHzd29vahpCQBNAGQ6Y5YF1Ew2ablMgr+5pwGu1wU0A/Rwqm7JGLVAjgA/kU5Zv993sHtRwvoRr3cHPI947FuX17u81umlzDKlpVxh6sFccfJPSyPTf1UYnXls5MRbdr4YoH9Bge5e+uPizuqVu+qbV7+/XVt/Vb+zc6zb3Uomkh3LZTG8VNdKuQBuNpu1VDblACfAROAGZAETcAfcwy3Jf3qexO4jrBZLB/mELLnHy7oL6E4Xz8Mn2h3r8lhv9KzdYSL6Waw+xwSVrmRyY39Vmpj/H7mRmQcn7/2RK19IwL8gQDcv/VGpvnrlyxpb1/5FbWP1ZfXdlYMZa1mhlATIruVLaSuM5iyT7lsmMbAsYCcyoJsCLAGX4rSwWFAxw2JBGgwGFrwHMOMWdOvrtRS+m/dTHiKZpIgPYcWYtBnPB90uk5CxLp682ehwj7j3rNnqsQoyFiWKO8WRuY+PTh/6xcLkgQdGT3zH+hcC8Bcc6M2H/vudG9ce/6nWxrXX9Tvb84OoYaVC0iqVjBXKGUvzPF1IWTKHZabwsAMAEbBDEwZNnIANcBUDQBWYiUTSwUzI1HltAKByHUOw9dWkwNY3HHBNUnwX6LwDTzH8B1aOK+n2rNFoWavZs3q1bbUG55KdWE6VZv6sNLn43sl9R/5m5Ogbai8k4C8Y0NXzH8puXzv/TbsrZ97WqS7dkxk0LJ+JbGwsb9lCwvJFXEMea8Q9WAYQtNyx5kFfPlp/cyruIoSlQJaBAmrwH9fdBjMQgzx81LtMmMDmUT8VZkAMZfg9Ac1zgS4XwyQNujBDrLpd69hutWPVWsKqDY6bHD87Mr3wh+Pzh+6bO/kDp14osF8QoGsX/3h86+q5H9taOvXW9tbl2Vxi10YqCStX0jYyWcB6sbY8Tjkj1xDGnABgcQa5C1mn8PFAB2IJXtNnhlarwfpzZiG8xmeGQRHrT4j2yb04O/GPhZtPir4bvgdDDFbvJxF54BxAdNqNrjWqPdtcb1qtzjmkR6ORyYMfGZs99nOFqcU/Lx553XD6njPuwdk9j1v3yp8sbK+cf/vOypnv6tRWCvlMw0aKgDyCFZcGli5yjgS7fg4w3IoVzDR6WVZsxfhih1rg6q6/Rd0AwwG86ZZ0+qbva2L4PU2WR0AB6548/l0ghR72HGTcDhY+wJHDAt0NJfUbOjyPuRSUh9+SW08lutZpbad7taV/0tzMTKfTmV9uPfHR384ffk3recBkzwvo3qU/unPj6qlf2lm98FWtnUsYbBNfnLSREfxxCTzI4wYYcp9xeJCLmUQasAUJw3dQ5Xo9mPlrAWS97iYYu40h4IlE5FaqW/DfAkyfjV/UROjmPoRfi39DL6f4T9ac1AEVOOW6FGtBQd6sRNDM8Hx3q2Ot1ppV16N7+ZG39fqdSu/yR9+b2v+a5+y3n7PriJ744MmN5cffsXLp1MlBd9tSqbZVRpM2MZG1QlHBRYxBA8GaCXYe2OKjaYCp6840YCIgh2CGZS4Y5b+vfykGzw03uBCnfnwWMEXvnOL5zaOjP+sRbG8EUi2GlH8uqeCoVeOLimPDTuCKZgTI3Y2mbW92rQas3UQFhjR/eXzutl8ZnTv2juzC1z6nDPM5Ad0++wcvWbvy0K9tL595cWvnmo2UU1aZyHPPWb6C1WTke7WkASvJwBTkgq261Q5YrgMsUwiLjvEJt76bwXb7hoEM/a1/MwZPrMRB5Lf8u6CV5IOk5DeCoeOtIKsjwjb89+RCmJA+Zqu7jprgtzTT+A20E5Aly4QCdusDD5Jbmw1r9wvkOlOb47PHf310/kX/qXjwG1fjGb3lh2ftOlrnP3T75tKjv7y7du7FUWPVxgF2fLJolaki/hgw4cmsQKgbFux0VlYnvyxrg7ppqYpVsHxliUmsSoD5oLWsBUZsxe6v40Dplhe7X7GRoHWIXLBWZJHuFAT7jSRdqXwUdfh96SRhMpOcgLsPWTWBVz5dZkCuHtNMkiaep2FIqTTZKee7sblr1Z3GBMvwn6GjVFtLH/n5/N7XVW8ZZT74rICuX/rwwfXLj/zXtcsPvyLdWLYx/PDEnnErjuUsBciWIpKTUsu3wpYBk9SajM/TY+5JBiC77vNcqbNnedIy3Crlm3skFl3PEoOfDsHTJ0b/iV0IJJa4ngsogdGO2g5iSt/r6HOBJroFM+HZjAcJfo90newwTfAQ4wj0j8+AQoKV15ebYRUF5kMiVSnYmJ5rTFsNq25fmliKEj803U/U2kt/+c7c3lc3bhXsWwa6ufRnc2tXHvmP22tnX5/obeIuEjaJu8iPEmKKmjJOBpch+gTcIemIWUDwp2le487guz2WsqgVwOYAuivNA1CzZIdpGIoGK/1C9yQTElLucJPVustRMHNmMiAIh0+0m3XQJSlK5VlJfAY24XlLRLruJ4PF4zp6EYIVE5jKM/G4DAGsu9/0805HNPkdS+bNRvhfCmo62GjZTmt9dn3p1L/sR9Ars3e+oED3V/9vbvXSw29bv3LqTZ3dyzZaiGx0qmAlXIblGUCmjQURkDRgp7PB4gS7A5Et8nrOIqyth8KWQl1LeSbI331YE5OQJOz3oVZMA5bXBSzWhE8Cfw9kchq+QA/BsC8fL0hwTyIRCp5o1m69SYJvR36b301ligREfhsXJkUvXyrwHHcSkRm2apYnmRrwt87bs1GtJI2FF2CXHtRTUJEREq4m79VX62STSwcG/cwPrX/mvZ+Zuvstf30rYN+SRVfXz3335rVTPxjtXrVytoslF3AX8LZcsGJkYQYjwVJAM/MetDT6JINB+AGELCcbEYC6nZTVyMiaTV7nP4lLhSKTVmJ5A3o6JZ/KqugxeYhBsmjd5FN1BOdjTtl0CxROEyAaJ9eUxIojMQqsuo2aV9tF3+AcFC8UI8rFlBWRAUqFclh3vaY/KqYkxLtJ07ucflrII3A5kcHqE/x2ZTRtU92cbW21rdO4dld19exP1h57/4Xybd9+9fOB/XmBbpz7/ZOr5x74V+3NS4Vyuml7JnNke1n0CjSbNBImFC6Jn/TA7cOWm9D6Y/D40mKpjFVmrAnAO9uRXbi8Yqcfu2wXLq4hPXRsDHHpwMKMHT+2YPOzFZtgAmXs4toJUnjJncHcsFSN2vUOYSwrj4FWYOXoKSw2grg32yk/5pWrO3b6zCV74uJVglkd2TVlC/tn7LajB+zwwSnXYBDywooYuisZDMvEKaFoKb5bKmE2GbEakjY5KLCKmra+smk7q4+/NpsvvImz+YXnBXR35WO5lbP3v7W+dfn2TG8HUJSMZC2T5wQUXwC4pwRC0Vt0QkvUCUSwMplDDyseMJr1zY498Okzdv/fPmFnnlixa8v4U3DL8jsH9i/b2krL7nnJYbvj2LQVWaZobSQPIbV2fiyLlo9VsiOQxbFl6fzdJ93z4wN0Kl1GDu3ZmfPr9rG/ftQe/uxFuwrgig1JJuaRz16zM+dW7Mtffty+7OQhy7AqM86CtPLg0gCr+0C/6/IrLoQDaf2l8xkr6jxaqIGslJ3q5uju6qXvWb//HX8xdfJHP/NMYD+jRdc3Ln1FfePi11ln28qlhI1VABnlzTGUKM9SE5OVmoZ0EdM40TYxEEVusYeM1ZoGuKv2Fx970D794CrasFkLopAi+ElU2t7ZQmd4EB/et7FyCese5+tMoAtOMR+Xu8AliHewxgPgMmwFV1yMAl/P8pxH1q6srNtff+Jx++jHTtvyGqIRiUc2l3Pfv77V5e8rKHZtywHcS18ya2PSwTleD/aiREouUKtRx5BL1Ficu4uXM/ZCMWN7pirMdZuxrN9TXb/4g7unf/snK8ffxEif/naDdH7O+9HSR8aq65d+qNNY25NDqJdvK5RYZ27JAjXQrVSSF7A0DTjpb8q6ecmDURbrGtjly2v20MPn7fTZddvcgR308oS8Essct8LzZjtpK2tdu3Bp2y5dYknutPHR4rmwAvFlZ2GaSdyI1w6Dj9Y5SA/p4EPTLA3IhG1tt+zc+RV76BEseaVj2zUYR2IUmCat0S3bbiNt19b79sgpXNjZFdvEnbVwNQO5BMviFniOb9chnOaJm3Meig+QUj4XYSCk6+W8+/pEtGvNreXX7W5cvfuZLPrvBLq+eeUeNIxXdhvbzCABZBSGgWDvAhF1Pc1wKhVbLyeXEnNQIhan00Fhw791k7a23rBHHr3IUlNEz1mzy4Cy4yRhBQCqWLtLgKxFdu7cNSbkMSwOy2ICnQHoWIOWsxFVZFSd8bqiOK/cB2wlzWkpgKazOaTOlj166gm7urxjdQjNgBQ6V5xg+ZNQZcdgN6OssIRtkm48/MglJpaMug8d7JKkWA5vyLkBsmLEgBUmVqgJV6DtKaKqQKEIjtscGS9ZuawAv31kZ/XSW2qnfqf8rCw6uvKHyfrW0nf1m1vzOfhxDi6ZKUp5wbRwF33IvCtnntnFmW6s6bgO7CYdqtaieG1OeGO76S6jN8jD5jifRN4DV4Koms0VASRru/W2bW7VnTUMmLhhyi22IGsmIji4QmKYruvRrZnUuS1Bv07avF3nuTgJ0BVGYD4Ja7Q5b47X57jZ3Igvy7WNmjVgQF14tic5cTauOoTnmHIj16UWBca4pAbIlk9ZrpxDCkaISiKz1lZfs7V26c5nBXRze/XO3fWrr+pHdReICvjmNNoyK8sisj9lTaJC8qFOZH1RDe8C5IZf7XQ61gGAZouRA6Z4bTpTIvCIKchHh+Cmn2o1O+jBTZcr+7wuP3ldIPKiQPhddxtxgOwS+LRyVDXRb3UBXAyji8uS61LiksIa3ZfzWa0Uvd5pD7y8pYnpIih5gRcfrtWCZ+Yweq4KEMcbaucKwUxyj9Aoo0sSr8pYtTDqtbaP7a5f/t7th38LlJ56e1rX0djZ+Ipmdf1oFlDLlZxlxXH5+kCcmW9o/MFPxgOPBfcbKpwCSrC+iACjQK4VELHcBXykwinPs1hiT1kig0yTeckVZfADek13L11h2Ql8/7CMFVSiIOgrocg4cCxt/GmW7+pRqypqSyTisSO3E5jFUE4dSPTn99P6vPN/aRrOk26sRrJCFSc8PPjBhks2yLNSBfWFNCBXkCCKecbWWHt1c+fabbcEdOf070y1tje+pdepJwrU9YpYcyrruVhIq69nT0MpMrznurBOyk8sHEp+NM3kyPUUUfjSJDYGB00m2gyiw3lKF1GA6wKyirRmlREq1KwWASbLc2vnHix/CKoCcLDSBCD3sGZpzbrlyQwnxvDL/FYWjaKQFTeDKqIm5hmHOHAKN6RAVmR8pWLO2xuYY69hesDl+D4WT8OVusseVSzgKHzQk1oxL8aT4FTy1EKLhLBEZ/soLve1twR0u7pztL27czTJAUVjdJdhRdR8ROpD6V+0xyt1wWfyf6+R+MyH5S6LZ3ESnbNkVFmbmq44kANqickEGgJgW0/Pu56GD/ptBm82OzduI6MESeijqFUoQ+keeHkYcFDeZIM9qN0A9+ACEwGjzKD375+28RF9Vudc92MO+jU+x3MerY9LzPVtZqZi4+O4MpdPwvkGpe+G9arM6FmluHus+Ln+4skMx2Uic1g188Vv1PLd2urrtu9/5+zngv0U19Ha3f7aqN3Yn6fGV4DCJBUAQ/nj+s2lSAUrDfR6gU6gS9wPj4ExEEixHIF8/PgBBoauKwnVaixZgUz6C9h5ylwjxKcjx+bs6G3zWLWsGF8NTw1LI+bMDkJwV0l8pSxQE692hSzsQ9x7lO8ePjxji4tTUFJ5iwYWTHLUr5Jeb3Nsjod+MTWVshefOGTT4xWAVsIjJqOJlYYe1L/gOBQWlW6EgOmFn3gi3H1KXQWjAmShANj9bu1Yq75x6BmBjh774EyrWf3KXr9J2xo+z5MTVTS1pGL5U5zd1044sIsv7i+09jQBvCZhX9/DWru0G0xPluzee47bS+5atMV9BZQ/WWANILc56wYZZ88OLI7a3WSGBw/ugUV0YSo1xKhgNS5TEoCGq0T6oM+1vIImgxihxz4uQi7h0MEZu+vEQdJsUvpx2BhSQTHXpGBMzEHanZ0xu/34XrvrroMuAWRdQiAIujAW7l6c0CjlKtBpVP7SeBVcPXeSn+eJV3D4bJ7kpwReiX57vl3fefXnAv2kzLDTrC50WruLAigLZ04XROkIXAgvUtd8ll0tg5YJcAc4nn1VPUWoXPfB0rzgiu9kyReyebv9yF6eQ4fyZTv12AWr7jZhIjUr4L+PHJ6ze++9g4Efssk9ZHek32nFbh+4RFeperFrIjDKpYRAKU0CdoDVKbC10EUSTIJcx8mTKaeNn3nwCbjyqrU6JBr8ptof7jixaCc5nqy+kmvzew3OWzEjZkuAKLqpcYjp9D1bjLVwGZN0ccad8oafYFiG5JorIqfuRsV+q/ZVW3/73t8Yf8lbrgwBfxLQUat+MorqIAL7lSAvvqjB+PINMyzJMenrJywh+SrXkQR4XC3xk+LgaT7X6bVYAW2boGh7eGECa7jd9s2P2LWVNbdCLfW9+6fs2NG9tm9vCTfCwES3kDEpKHkATWI5CsWefWu2VR6Ljz8gqCoj9MCpbDTdsVKmYAf2jbukOj5StkuXr8LRG57O75kdsTtfdNgWF2ZtFDVu0NnlvAGbGBGsWcCp/qixalWGAkUoOojCxsYVxFrGplWv44ZWNq2MqFM72G3WDvKBpwI9WPpoZu3s/fey1IlDEuEVcIJLoCfTZ84DnostQd9wMi/3oY85DgI99qGabP+8/B/BiF6PAv0di/vLPO6xShlrZ5olPY4RkCbGsEDanenl5VAd2AqUzKvbgSY6N1cwwsq9/OTBacBqkdPXGWj18H+AUw/fCJF1YW/FKoWMjeH/q1WCIN/dMzNqRxYIuGMevNCtSff5L3Q56XdDPJI71EjC3yE5C/lByGBcUHSfPZSHsXDAFu5RL5rqdFrH+NjHnmrRg3al063tV4dnjl4MdXZKJgzmrMcQ8a/fPIAETqs6n/vrodV5lA4nlYtrh30ifZHUtVQo2mhlwmb30HuHX5PFpnFLWSJ5BpaQxEJFCwWw6GSIBjpGHLfj6B+q3kHrwNl7wA5+VOJQjWWdsAr8P58vwnxm+LmZmEIm0L7l3MlAWW0Kglp9om1OYcUy9LtYWdp7/JQx3siART09LmnMPkw17YT0WFWYJC6MRI7+7s7x6Or/yafnv9L7Qa67Dix5tNOtTw2s7fKkAlEoZ0j6lLnGkT9MpR/EYY/LQ1qWWtYDByBEa1lZRC4s3Ul8VMYnF6CoX5zN+3JUx6efMgCj1HvTixINRXqVnUL6HSij31TFjpMWDU6ByjNUrNqrj3y/i9zZ72HBTIrKWhWEtlw659YmJtPvBXehyRSYcn9BvArikeK+FzHciEJpzYv6fnwNPIxf+Ib1HDyM9G4lXi1P69vHe90OR6a780lAd2rTg6g5kYAvh2qDrCoenx9QPovl4XqwPEbozRj2Kvvy0gFdP9ZC1JkAtycCiPmaCAJO1K5bh8idT5Ws3Wqhz5Dea05didMqCa1iYRL1PyVGoZR1nea5v9T0AAK/pR5oJUwZlbFkiToHd+KhgqK/exQZItURlRyJknFevvD8uMHd9f17aNqM3/UWBXiPCxpzjHRscPHJhUDoVqdJR79U2xu9IVG7tTfqtgT02pOA7rXbM/2oPSbSn3HRSD8cVBadtKraGhrnyipVRVmDC1HZWwc8cREegZ2EOp+yt3AiDk2ctmYYpWY+Lxm1BcdlYAJIAw5pkJDX4EKADbxdIw5+0fOiYFP4Y9wP+oZTP600T+mDhSiOZMSQ1N/ndCl25xobVh9Rj8xIidME6ziaUHcXw1UTzFZNN6HThvPQMKXziGvzpxuHgiK/qYDoRVzGCchj3XZzzEG52aL7nfYiFeGKQFZjuL4QeLqcliY8VBvSqj7rm0rUfEkHTukDdcYV+/E4kUkzUPFNNar0sVZZi75HsPDvKjHSygggB9Hd/aXABDS94pPtk6hPyPmEgOXHZuY9IHmjjoCRb9VnxQaCG/MkR1bv3ofviqbw4RzbDAbewKM/NVju0qN51MoV+0Bx0lHcDblVe3oe+kp0PG3/0G9qZSTiYCij63XZ6NRu7XkS0IP1+xNbZ/5qrkd3fD6n5acj60fl/8IPu6PFctRJn0J5cwqkGZV8KUqkpRoqoIASWgSc4Lu6RjCRsajkpdqcm2SQndS7EWlVeCapu34mVKylAYdCbLDeIcUTr43Xq7sQcWiH0INjmGhv2HHpM3Be/Z5/xo0iTIpLvU5Vhhu4lJDI8vU6zzGMJL+n19LkAgbvd4nYNXnho89pYnyZuz2qXSJLfGtE3QIWPfkkoGX5OKWyZkxjUOdPUPD5O08aji+lL8q66pavowcQrbucXJeIXa6MuvWnCKCaeVcgxCt9ILyu2dDEqW0Anqr/NBHKLr0ASwDxU3SC4/YbbsFt+meD/9R5aTXI7gKjcdHHXVNs8TED8g9J7XEPIsA1e7F7oOPSp8LNH4BbiOQuHIUGM7k8nYck0zYJkIJ1p0nC1t8Kia+K0UgGJbqHMtQ2ZSjD0w0ybpzIDXq5QRSNPhloqMIg0huhYhGWYfCPfUmaivSc0852wzbXaq71+oCxpPrmllPBPLPoLVR8NwMHDl0CGiS/qQSIbRR69JPVULxigFtRuutLUZYX+2I3vaCVDDFxVuPfjf29m+TQN6u+KHcTVp/XLEU3HYN4HL6hCPcVuzQtPjXPJCWFApa06qgLtVTmidvp4DK6vC5j6LYpKFR3XLRKkM5XxmiPwLcL4ySPLhMo4PoBFbtk4IP0oNct9Tc/nUhOvNTLyZyU+h5UYQ1N2u6fYq6YkgqEf6s3ml6SalTpe6ZCkSRH7vmyop8YwX6XqO69dGIj0pXpLnUGADhyuSmsQJ4gyCFa8Eo0AEhpLOY/VORS7vtiP68A434smLcbqozPI334w0taMZ8WrxdD8ETCz2eYtodkS1UYd2ccXe6gz7kTm/w7ESu2F8klQs3kTbSgOXGdSi6Tx3jw27xXr69zTl2ySqwaMUunppUWXQc57v5THhD18kyi20bMo30fQmuoSvngVFZn2tuUl9iQ5gXMRosDU3ObnDuKsjdOuYjkoEUFpd1k1iVFMjisJGKQbdETdGIxDWckdGYGUShYaVJCkVaNfIx7l1gziEEdAn4D6BD4nWY6jfFateBT1AxWPPTLMVtxSSDupRMz8iRDPN9VR7kJHvvIpBhNmtWVyxdwg9w1QRhADiFGvlnGUkbjTaIoXrx4mm0Yq5bdaFDKUrUoxBHFKY3Hm+1j/+fN7zogZxiAppTQl54Yl4rcPfvqRYLkQAO2jDU6DVumHarXoz1qKmfj+xZsFLCdftBSJetQ0qF9ge1Gw8GHsDMBkkJVVWkQwNEU+JyWsPc/c5C+dG51TXBSYhlDBnOdZcQpsc4pJLvx45B4KBjrfOOmHY8vsVvxxSoVzvVrWaRWEZyeJKbAXR2kGQlBsI8CdcxiHr8r0VzVd9xhmvjky1DBknFtLD1h13Zk1R0rjLNzmvqjdzTFvtk18kB9hkXqTpzbhMwwMfPq/upH/0PVOfFwucUprlxEk3ixhm9W18/WNkXUzoR1cvttge6i4uiEt0slNaNqCgT0NPeSp8Zke1LxlKkhEkmk78vi4yCjSfGia3BdAeSYKroD5Cw1KZoRVVAcaK00TCYAH1zMsC1BfDlw8Niq3KeGVDlFj0CS7DBBw6L6ANMpqgwwLO0ux8gsC2g+EZL4FGCc1oohCeOOrVy5aJ98+Jx96hMP8XbNyhQoZlkROXdtUhflZoKvDlGY8moiWQdPj5A31LtkahmC3+aNXHAhwanLV2Wp01QmJ2gBy9rpc5ft7HJkT2yY3bFUs8PHT9j49B6bnpqgfFTy8wxZmfb5CUh+B+tNAaCWpK8Vb/EUN+UzXXpOYpfiamBswYG7BrYQaIsC3JCT6DE8lzsIrb1x9uiWoyilj+gxMAq3zDQWKr6shYxl+z4Klek86Or14ZqHjMDzt3ertrR0zdZXl+3Rz3yK+98A+CXbP497Qe7NsAIsEfIBwauUTmJrHMQ7TPxOcuZljvp1oBOJ/FIqk9/t9Wq5nlwBfQ4JIqp2pur42dGyTe6dxQKu2rmry3Zh+y/tgbNLVDMeQXI8hMZ7gtauRZS4Eaol1OxYgpIePZg6eCLdShw0+JjyuYIuDhts0xMEfdRFhNgFDIEfvq6zHr7m/FgTp88qW3JiH77rnwucOETQoT8MsmcQJ5wahbn3/eQRcmrN6rRWrayv2ZkzZ+yhhx6x82dO29KFs1bfuojca8i5i7Z3ds7bjJ3zSytRYCUmiQ56c0CKFttUuhoOcDPQqewmVwhgQ0ESYSmO9HH6rdFXKkVbPLxoU3NX7PzyNdveWLNVuoIee/wcVYpJO3DgU3bw8BE7duyYHTpyyObm6aHL52xyfIzsDy4uJV9GqjE69dDAQw/0kDwHmVWYBIsPenfs9+LFEEePGKDAWwOICkqhS8r9tS9pzWGoxgRAA+vwlzXnqrZD6zq4shY9asurK/boo4/ao589bRcuXKDD6jLWvEab7hbbcVA1cXOjoyVbODBPmQz3o3nVOQbJz/fFhFKX9Ol0I53JPhXolF5MZ2pdOotEb9wfKmqKWaiYmR6xg3un7fCBGXucVqo6rKJOoGvRr1Fjn94qzSinzl6wT37qIdu3fx5LX7C9+2bt8KFFaoUzNjUxDS0sElzxk6K8cWYlKhjUvgCw9qE40xA4om1KRpwOxkBJApDvdQsX0GF/iu8/uaknzxmNJkvauVYO3/GrIEDrtFm/zXk32A20fOWqnT59Gus9S/fpkl27qjaxHdrS6HSq1z3F7qP45fM9ZN6Eze+dsMWDc17Zl9KpE3FbiTUYXWUhUqDPpRuZfO5pgM7lq9R+tsDVrwbQo3lD8UClIf1InoRjz0TJbjuy3x597KptNTd1sQdOpAgYOW9g2VinWXG7ZucuXrJPPfCAjZI97Z/fi3XP2tzMHH58xubmeJymSj05hnWMetKje2gvE6iBdw8TpqAT38ytY9OW73U/I2vCMsXy+E/d/EMTdjqJFTfJ/uqIV9Vq1ZaXl22Z6o4eV64t2/ryCt2mVwG2SnmtbrvcO9pDzpilxGVyocA1oE2hwn6dffsmbO+8VqmyUW+HileVzj9cSaHLykolUtVUNrcbv3vDR6e4agtXblmO6ilqbz0rc+JpvpTVrlepd7QEqAnl4MK0HTk4a2evbHkdrsEgVMBMoMSx+ZElE3rmarUWzeb4uqtr+OwyBdlR6nVjDrIeR+i90OMMgbRcLjOICr0RRSuwQbFQoFpOfBhqxAI77ccIgAcpVgYvns7SdwmUshl6dgMX0IBe6t7i3Da3N2gc33CQ1bUqgFfX9dqWbW9v0xBKozrn6c3s/F8rOYerkyqn1EZ8X/XSHKn3ocPTdsed+2x8QgbW4njsGMio90SxRZNMg4PIFn9nsvnLqUwOaTLcrgfDVD7fAOzH1azSVvpJmp2h9V2pc1IVX61dpnYftObEiSN2+sKGdS5su+NPq/GPE23RYtXmpD0YYHF9/Kt0j42NLfqfNx2gHJ0tGT4vMMsQ/omxSfxdkZ22Iw52Be2kVClTBYHTEkil/ulR9yHIQXoN1RXtW1FLl/ru2m3aaGkp2wHUXe61BrupqttY65a7gXZHrg6dxhW54KpU1daK0sTKkkWUpHGHD/RoL9sCzF3bM2Z29MisHVqc9qp6inKbxxjciscExtzR+MFN1IvdW2dSucJTLTq/+A29S3/xMw8OEhm2jbQzfRy1Kg2acflLCUd5kpcsQeDooTm7685DWMUpq21vkh3KpyqjoutHQY/POjVUW5crGfK7sR4gkabFnuvqrm0hiS/ZxVhcyrj7EBf2gQtY7woKz4euJbiXoF/4cyxPbWZyXeLn6pWO5JPxk7J01yB0cRU5FHf9uASnhCErbbmOzSMZrktiiFF6L+PKYdgWMkFDz+3HJu3O4ws2M0XfIHXJfoZ8Qfiq8q4fp824zRaOtnBL5luZfPnxdC7/VIvWBCbT+bO0XW0MusnZAZcxUpasrhzNmqTJPoPu9ne9cn3Hsf12/tyyXbuybq1uy3sC/YCyNk8MQlDzHo/Y9zrDEKUVuVfNUYPETUkmTRBEejHdakp08vQ5ljh9Z5YERlliKBorAdHNkyBnGkEv8UZWeWtejPhtCV4qY3nqL2YgdumFDJkACQeTKp0iYrKkJA6357lUStZKn4aNkIofXpyzg1TrR+mEatEqwbZlb5zx/Y0eJrQadOd7+WyVi2mdT85+ZdAb/KxvumXw0aSnV9Xj1lebq3bNOKUlJMKtXcKjj0J7P6boj5inA2mUQmeWvmW196qw6tUZ9S8PtWlp2lIlJPRI0NGq9+0LCoC6fgcN4JSz1Hcsa3Z9VYDJ9UjV0PKUuOpbjYcVHW2mx3IBXi5Nn/UeT2WY2uDj3VVifGoBQPf2nw0B13vn1DgZc21nDPydJiskwpBkRTwy8RSp0/Rl5xG+9owXbJYmoBFvkGlRSA6TJWt2UYAJZci+zU6uN5HMXcsWR560gehGZgjg+cLIRiZXeXhQ272np5mh8937ENUmFatTkD9PRnTw44dm7fz5KeuxX6TOVoUEKW2Egw6BPzS5eLrNaNQ6q+XYj6ucoe/YpXzvn/Cqiaogns/EVZahlTpP1n5CbRINvjVoImJHIQEKoo5+Im4jE7hYqOqJkjoFtvd9aPXwVA0+vi3OQSYACj3OIlzpQolHjQDWtH2zZbvjCHR1Hy1mMBBtp5DpeAONQJZEoH06HMATYQS4TKbycDZb2bzZiJ9k0aN3fU+7UBh9X2+QXtUlceTcNVNBcNOyDM4/g0+Znczbi27fZy+75ygnMxI6RXt1ZlT7QLSWxb9Vl1OBAPBdNwge23uYVFkBI73XFYuQTqGlK6vWkFXa0t7BNo00+HQ9DqQXq4DAXS21arkVz9Uqcivz1jWOSSLcU/OkAOO9CMbQZaLkhXXH8Kyn2p4nQ9KiCZAUjftdOpY4/zw9gYVkw/aMJOzF9AK+/K7DdnxhzkparbiYUNZTtsJ4xIedBCAXcwkhrtlUz+ZH/hKL3r4Z6CdZtN7IlSceqa5lT7fatT0i9TlteBT5UTFSRFx+MkkCw/LcS/vWy+455tRJdOryNaWhVW9gCaV7lqH8q9cZlXyI7MYRHXBD9TnQKG8jkLVJbJeIJLzdi+gUY11Z1qPlGbcf+i8pDXZ1TS5OwBPIBKQmi5WiSk7oOJEFq9mcAC2Xwue82g0DGWA8XpRWqwNJiKjsaCmyO4/us5N3HbATR+ZsaoQdCp11nypvivRVGBIV+eV2PVyrCeF9KVccvz+/+DXx0gpwPwVorg23lCxU/ne7uvGKZrOTLqoHTwOWyK+Z5MR6dIOqczPHnurD+9hu9vLbHaCP/81jdvGq9Gisgx/P+gZLBbGQ4ak4K9BCEsLJesQWc6ArSYDLxOX3+Lxa71IAk4OnqgknRdDSlg0PdmInqorwh367y3fauBL30eTFkj8ljXKJR8BVg4xcknhymGRXBDX12roHI8mRKxTVdEJna5/mygpZ3+EDI/aKlx7EomdtdoxxdOkFYVWpa1UTpy3PoYKDHuQXxpLGQcNOaexvS+Xxazdb89MCPXnPmwdnPvT2P9itLX17o1W/p9IMJaSMiDkzp9JP6AaSTyFYMLt3HJ3BCvGHCFlR76xd24DPshqSGXanejusKh8EIw0u9pN+cN5L4mPlAjIcJMPJa+YLqGoS2vNYXZlOowpRv0jOG3sV9+GaNO0pr8KdW7iUGku/houpo3m3KL+xbYUZAWToprbpOVNxHx/3cSg9d/ElUL82yc2AHVYYrh1ZnLBX3HvITt59yOanoLS4kahZw5Vpz14wEq+u6xnjaeE2dCGsRKpcLZWnfg+wvZfj5ttTLFpvVsamzrQ2ix+kteoE+0rYXUx6SeKiAKfKh0d/3wOIdZMKFTITdojU9FUvv4NJKdgjjy/buaUNtrVp0DoZUbKQfLhCqvKRggnLL8ck5HlehHmMUuEY4z5Lxjg7Nm5jJDIlOLSsrZDhCgouOoX+DQXdLpO0yzEaWHS1CS+v79p6vWrru7u2Semtxrl1AKSNnKCgmVDHv2giYxQdcwonvZoAqv06E+xuOH5oyr7iZcfspSfmYVUFDElWjgXBydUhpxTfW9X0PX6701QmSkUJhpYtlD4xMjr56cJtXx+rXTegflqgZ7/8J6LHfu+t7x/Uqq/vthqvRKEO+1fkGymn6yBe8ncdl6ystknFYszuopFcl2iokNRox8CVlR32+THbSuf9cg6cnLQArD0NWHksTG1wE6WizZKKz09O2R70jz2VMZsqV9htBweWz2UisjAYUSrdhs0yPVZBGwBbWGeT5VRD5NoA6Kubm7a0vmmriEarNDfuEMAaquoAvIoU7sIUbKn9paCmuhZfBX9xx9FZ+7K7D7tf3juFq8JdqGDh3U2e+iv70/6bYUOR2imU+iu4Z9cKubH35SvTlz7Xmp/WdQw/NDKxcGartvHeZqt+opQdjHqWjf+TwB6uBQpt0oUBtWcGi8jQVa9U/fh+Ub/jqHU5++Qj5+xhrHuLPYRNlrU2SqaQJTP0443iimYoI+2bmLRFtN29M7M2QRo+URph0rB+beZhYM7Cg6bJgIe9H8OtdexB0YYjlnOfikmHVbHABB0en7Dl6V1b2d2xc6urdhqxfgUrb/oWDIyAuFBDZFLH6gj7u+f3lOzo4oy99EWLdjcN6mIbqQiNjRWbVOOl9Oq49phiDJrwNOA2SefrO8gVbZrZC3v+sDS58MfFu98Y8vtbcR36zNxr3ta78Ps//qH68uarqrvtN8sv5mlM99lUio3PjeSXVDlRqR91i1fYJNyxcQC8B1okMUnC0dkLa/YEWWRju+oXQxhHtNlPcWDf6Jjdubjf9u2ZZYvDGNbLFgkFR1kRKbVAVubnlXWFoKFSxvl5zxtWLr7vKis+qSyKCM+bKlRshstFbE6xOkifyyhtZ5evuqXXoh0PoilOpESWd3D/KDR1we6+Y8H2Q1On2Y2QQzBKajeZuqt0PQ/3xqFfxfuKXFRX7ATsupoq06cLoxP/a+arf2Lp6UB+RovWm4vf9ItLj/zaN/9cvd2+PdfqnfSOIA4cNjvi+9BBlBmptUqB0uOEghsgFKfH2OZAtYVBH5hasT0F9mifv2rd7baNEbn3jmVs33jeprlyzRitCQVabZWZKag6qFoxEtDly5W4yGUofLmwHoKRxJiemnIU2HTpNqwtgaijzfI5/tbG5D1s4TvMFj5rkobT/LPG0qc8aBPT47bvwLSduHOvHT08i5w7CUvCD9P9Tw9iKDwoM/XVFJIvHcevRcK5RBhAbZfe6kFuN5Gv/GZ5Yu7jfxfIej2u+TzTR8xO/eo3fmsx2f5Fltl8mqRAuPq+QYIQ12/2VNpbXP1yOdrURhJLlXlXmyYZ1fZu15avbVAOumYbaCMDCgWj2YJNUmOkzwlLRKHDd+a4l7iIShamkFUjjqpwEsN0DNekQ+lJiaJufd/UwzHE7R1siUv4Y+qQTT0yEVVA2yWO7PDeam3Hqt26lcZHbT8r6QBy754ZtnsQKDJ+ZV92J/BZjcAlUr6vrFHFWY1Tx1fBRi6+g7/frJIcFad/NT9x8D/v//r//Pgzofi0wfBzv5Admf/zxual+yD2bx8roQz7QLVJUgGKKE60U5obqcdZbWAApUtSFng/jxMvjaRsJjtiR9j42ETPbiPKdNnvnYB7Rls71qMBRzte2wwqUrMKwOconupxePWvYOewH+kkAltCDuvYsz8d14HGXwJyCzlUbD/ypsMeV0zI2jQ1zyMqprJ7Kj+CbkFtUxsxk1C3lF8wVmJ9vL/RZdjASrTvXSYcWiNwExwqgmFAqTlC8U+Shcnf+nwg37JF64MPv+dNh1OtzZ/n4jNvqHAFLe3h015A3WTZWUBBXg20TUVd+TIeu2oaVJ+OKB7NkUk0AfWAC+wORdA2u9+7aMgtdsh3cUURwVKb3QWwLFmxwDtUhw0ynsKH5p7gO8Mecb/2gOia9qFwuAxbKlIlJhx9IjNSoA9jhEeA5fWkNAsvK6rpXTt75efDNmkdJuxhVAsZblINmi5yYVBc+KoFyE3lC1H6/kFx8hcK+49/YO6r/w3wP/PtllzH8Cceu++NL890d94zkuvdqf46bRsbtoEpQEj3dZ1XuMoC4l22es8TFl5M69rNnGxf/lR1U11Qm6pIEz7aZENPs0ajDby0p85VXRlXF5aXX5T65+5DSIRqi27i4lr2mnRdezqjPYcE7QLF5DSXvRioJ1Dg0h6clIFIFQwRzVmMK41Ko5X56gIrihPKQv1SbqJ+irnaXMoVGHCFba7M0OymH7f06M+O7D3yvpmv+3e1zwey3r8l1zH8oWx5/lON1cbPkh3+TDmR2KvFo4vneiOg1hQ3ZWAqUIqb6SJRQaSXASmI6qpcoR4nmphyywIoXaybLcwlLvMz6FXcRQjkNi4lbMhRuq7O/iDSX7c6CfTg7ftftIvM1X0Ops2duuiK9uHA+8OeWJiM9HVfBeq7C4083u2qa+Eh+GeJNf77MB6J/gntb5HejKF0SFS8qTaRvdhJFe/LlqY/cKsgPyvXMQT78v/8sbHW9sWfLGRaP5pPdcfzAJXVRh0tNpceRZ0YHEAre/MLuTK2rNiEmsTRun2TUTzHwwusDP+RBM2KXx/afW6opChme2dSvP6ccMQWratsuBPVT3od1yvK3PDeWlWx11EHYBDXg4sR2LJoFRSkRXsXfSzT++4ASQf6dwYYS5sD1mj33WomV9rpiV/KTyzcd/Tb/stT0uxnsuxn5TpugP3D+zuNpX+bscZbKukemoy2qoUg5QqddmIBfkdahla6DNzdhloLQEQNhnEnoOeqCkIxk/CWLkGiZR2ehMNqZcQn4BWUeALEn0X/nPy5yB16+rxJU4/xdmOH3nXtIdB6Go4hsFU7dGrqfD1uB9Z3cUkNAuVuP7e6Oyi9Iz956N1H3vgLK88E6tO995yA1g898Zv/fDGqLf90Iap/WyHRGy2RlWW0bULyoYi+XAiPqqDrxNO8kFJAVJOLN5QrfMW3uElQf91oCRtyz/Cp4dUTfDLlDOIJkHB/o4UtWH74vJpH4j3pcTONB0/Js3HmI6Pw63HoNz3zZOXhQkJhQR1aaahiH5DTK63k6C8lRuffddt3vmvj2YLs5/NcvjT8zhPv/+FDrZWLP14cdL+XzS8TBfyiXxpC24YRoZQwSg/RYAS0VzjcxzJYL2fJSsMAgy8P3UnuRmLwh/8syLDdd1h88/5tuQUpgsFxBYDlRfz3ArePcbwxsW7h4TiuKBORh1f+9SJybN0drLuDBFpt9c93MiPvTo3tfc+RN71z/bni9byA1kEf/823ziVq229Otes/VrBoXxG/lmUfYZLLnGnPoBi+dyTLmr1fWBSKCK9gGWsXobX4ZpcxtGLlucP9JTe95hYbgHYrDXWx6yl6AFv7b+QGhomOVlEonenzviqcEuoqCUHu9KvUYCfEYGgcATBV+mQ3VXlXYXL/7y58y89ebx14LmA/b6B10KsffPtkffnSGxL1rZ8ig7xdwnmaK7LIssO1ogmCsmhnHEqRCZQMTgFqaM3Bz/oijh+CDwivCpAnn+rQdch83SfH4Ieej7B65H0daFmq6KdWj1ZOfOGTcP2RcBwRJe1/pAfHmgS+bqL0R4Pc5Duzkwc+vPCGf/8U2fPZgv2CAK2DLn3gpzPttYuvTTc3/3Uh0/6qLL1qRjKgnEaX0VE67dFcsPE3BhP+wZohHx5yZN73no24yTGk3rHFSqqMffCwr0P7ZoZB0nd5uZXHwo/8TAzRcIuzT+zQkfsxwvE6aDVNkitqKM1euvLfUuXZdy18933/sP4xhZtn98w7vvMkV3380UKu88Z0KipqE70SG7GS4DtDQqMCqS7qNmyICdXvIUBayuG9Gz3RQ6sN2eiwa0m8eKhPKxGRK7n5H8cJnCK+OoHPiP7Wk/CaJ0ZMRguQYRdnOsnyuweFid849v2//qyZxTNZ+Qtm0Tcf5PFf+b6ZZGfr9Zl+4wfLucQrkoNWsuj/ahBahq416jSanU/uf8PyjWvfccC8EaVd37jOUELg86vcxKzD9epYlwiM56luRslR8L9BhXNxyNsogjXX29Fmq5P47ShTfl+qtOfjR978nuftKj4X9C8I0MODnLnvO45be+vrU73mtxazyZNcLErJedgm51cDk02rtTbozZI6XZIM3tUzToGqmwAWw/C/BZQLtKEPJLCGUNt0DhxnHsNgq+/IatV8KNCVbivTi3qJXTL8P40S2Q8M0uWPHP+B333Wl5S/VV/9BQV6eBLnfvXb9yW79Vem+q2voQPolfyzTUf5V92kQHrsV/YlmVSu2FN0LyYE9+CtW36W6gIKv+h7z4dnHjOO6zts45ri0OK9907KBeB2dV08LBgp+TJAf7iTyP1+vzRx/53f9zvPKsu7VXBv/twXBejhAS+89ztG+43qYrLXvjuXStxNfvMSNnm+mOA0FkBV/TcocV7GkovwFgVH9+YHt+gQ+AKDDjU9ZiJsOQt3rQj19TAxrX5iCU3o0/QufwKl7mOZQvGhQ2/5wM5zAe25fOeLCvTnnuDZd31zhauB7UXFuZ3lfxtgHeaqMwt41KOIRbM0w+TVd+Fpsfz49e1lwj1klqJlAjsQieC76ZVuUiG/wr9t+EA/mXm4n8o91E1lT/XS+WvHv+83rnd4PhfAnut3/l6BfrqTPvPuf1pGNZvDq87QQLMPk5zHecwxEbpSwAiWj3qPRiX2kki2uVJMHXlzE61ihYC3zIuXeZ3trdnlRCp/6eiPvP/zasXPFbx/9N974r5vS+r+j36gXxrglxD4EgL/vyPw/wB89z+WjXTqwwAAAABJRU5ErkJggg==";
				var blocksXML1 = ['<block type="controls_if"><value name="IF0"></value></block>','<block type="logic_compare"><field name="OP">EQ</field></block>'];
				
				this.appendDummyInput()
					.appendField(new Blockly.FieldImage(icon1, 18, 18, { alt: "*", flipRtl: "FALSE" }), fieldImageName1);
				this.field[fieldImageName1] = new myFieldImageBlocks.eventparam(this.getField(fieldImageName1), blocksXML1);
				

				var fieldImageName2 = "imageName2";
				const icon2 = "data:image/png;base64,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";
				var blocksXML2 = ['<block type="variables_get"><field name="VAR">i</field></block>','<block type="math_number"><field name="NUM">0</field></block>'];
				
				this.appendDummyInput()
					.appendField(new Blockly.FieldImage(icon2, 18, 18, { alt: "*", flipRtl: "FALSE" }), fieldImageName2);
				this.field[fieldImageName2] = new myFieldImageBlocks.eventparam(this.getField(fieldImageName2), blocksXML2);
				
				this.setInputsInline(true);		
				this.setPreviousStatement(true, null);
				this.setNextStatement(true, null);
				this.setColour(100);
			}
		}

		Blockly.JavaScript['test'] = function(block) {
		  return '';
		};
	
	},1000);

})
