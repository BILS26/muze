import { ScrollMaker } from './scroll-maker';
import { createScrollBarRect, createScrollBarArrow } from './helper';
import { VERTICAL, TOP, HEIGHT, WIDTH } from '../../../constants';

export class VerticalScrollMaker extends ScrollMaker {

    static type () {
        return VERTICAL;
    }

    createScroll (mountPoint, dimensions = this.logicalSpace()) {
        const config = this.config();
        const { scrollBarContainer } = super.createScroll(mountPoint, dimensions);
        const prevArrow = createScrollBarArrow(scrollBarContainer, 'top', config);
        const moverRect = createScrollBarRect(scrollBarContainer, config);
        const nextArrow = createScrollBarArrow(scrollBarContainer, 'bottom', config);
        const {
            mover,
            rect
        } = moverRect;

        const { height, width, totalLength, viewLength } = this.logicalSpace();
        const scrollBarWithouArrowLength = height - width * 2;

        rect.style(HEIGHT, `${scrollBarWithouArrowLength}px`);
        rect.style(WIDTH, `${100}%`);
        mover.style(WIDTH, `${100}%`);
        mover.style(HEIGHT, `${(viewLength * scrollBarWithouArrowLength) / totalLength}px`);
        mover.style(TOP, `${0}px`);

        this._components = {
            prevArrow,
            nextArrow,
            moverRect,
            scrollBarContainer
        };
        this._scrollBarWithouArrowLength = scrollBarWithouArrowLength;

        this.registerListeners();
    }

    emptyScrollAreaClick (event) {
        const {
            mover,
            rect
        } = this._components.moverRect;
        const speed = this.config().speed;
        const { x, y } = mover.node().getBoundingClientRect();
        const { x: rectX, y: rectY } = rect.node().getBoundingClientRect();

        let positionAdjuster = speed * 10;
        if (event.y < y) {
            positionAdjuster = -speed * 10;
        }
        this.changeMoverPosition({ x: x - rectX + positionAdjuster, y: y - rectY + positionAdjuster });
    }

    changeMoverPosition (newPosition) {
        let currentPos;
        const {
            mover,
            rect
        } = this._components.moverRect;
        const {
            totalLength
         } = this.logicalSpace();
        const rectStartPos = rect.node().getBoundingClientRect();
        const moverPos = mover.node().getBoundingClientRect();

        if (newPosition.y < 0) {
            currentPos = 0;
        } else if (newPosition.y + moverPos.height > rectStartPos.height) {
            currentPos = rectStartPos.height - moverPos.height;
        } else {
            currentPos = newPosition.y;
        }
        mover.style(TOP, `${currentPos}px`);
        const totalDistance = this._scrollBarWithouArrowLength;
        const movedViewLength = (currentPos * totalLength) / totalDistance;

        this.scrollBarManager().performAttachedScrollFunction(this.constructor.type(), movedViewLength);
    }

    triggerScrollBarAction (movement) {
        const {
            y
        } = movement;
        const {
            totalLength
         } = this.logicalSpace();
        const movedYPosition = this._scrollBarWithouArrowLength * y / totalLength;
        this.changeMoverPosition({ y: movedYPosition, x: 0 });
    }

}
