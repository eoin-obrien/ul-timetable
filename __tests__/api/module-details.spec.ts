import * as cheerio from 'cheerio';

import { IModuleDetails, moduleDetails } from '../../src';
import { parseModuleDetails } from '../../src/util/timetable-parsers';
import { isValidModuleId } from '../../src/util/validators';
import { webscraper } from '../../src/util/webscraper';

jest.mock('../../src/util/timetable-parsers');
jest.mock('../../src/util/validators');
jest.mock('../../src/util/webscraper');

const moduleDetailsURI = 'https://www.timetable.ul.ie/tt_moduledetails_res.asp';
const mockModuleDetails: IModuleDetails = {
  id: 'CS4006',
  name: 'INTELLIGENT SYSTEMS',
};
const $ = cheerio.load('');

describe('moduleDetails()', () => {
  const moduleId = 'CS4006';
  const invalidModuleId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidModuleId).mockReset();
    (<jest.Mock>parseModuleDetails).mockReset();
  });

  it('requests and parses the module details', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);
    (<jest.Mock>parseModuleDetails).mockImplementationOnce(() => mockModuleDetails);

    await expect(moduleDetails(moduleId)).resolves.toEqual(mockModuleDetails);
    expect(isValidModuleId).toBeCalledWith(moduleId);
    expect(webscraper).toBeCalledWith(moduleDetailsURI, { T1: moduleId });
    expect(parseModuleDetails).toBeCalledWith($);
  });

  it('throws an error if the module ID is invalid', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => false);

    await expect(moduleDetails(invalidModuleId)).rejects.toEqual(new Error('invalid module ID'));
    expect(isValidModuleId).toBeCalledWith(invalidModuleId);
    expect(webscraper).not.toBeCalled();
    expect(parseModuleDetails).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(moduleDetails(moduleId)).rejects.toEqual(new Error('failed to fetch module details from www.timetable.ul.ie'));
    expect(webscraper).toBeCalledWith(moduleDetailsURI, { T1: moduleId });
    expect(parseModuleDetails).not.toBeCalled();
  });
});
