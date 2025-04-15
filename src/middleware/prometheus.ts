import promMid from 'express-prometheus-middleware';

/**
 * @description
 * Middleware to expose prometheus metrics.
 * Collect default metricts is set to false because bun dosen't support it
 * 
 * @see https://www.npmjs.com/package/express-prometheus-middleware
 * 
 * @example app.use(prometheus)
 */
export const prometheus = promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
});