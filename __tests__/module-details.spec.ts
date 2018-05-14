import cheerio from 'cheerio';
import fs from 'fs';

import { moduleDetails } from '../src';
import { IModuleDetails } from '../src/api/module-details';
import { isValidModuleId } from '../src/util/validators';
import { webscraper } from '../src/util/webscraper';

const moduleDetailsURI = 'https://www.timetable.ul.ie/tt_moduledetails_res.asp';
const html = fs.readFileSync('__tests__/html/module-details.html');
const $ = cheerio.load(html.toString());
const mockModuleDetails: IModuleDetails = {
  id: 'CS4006',
  name: 'INTELLIGENT SYSTEMS',
};

jest.mock('../src/util/validators');
jest.mock('../src/util/webscraper');

describe('moduleDetails()', () => {
  const moduleId = 'CS4006';
  const invalidModuleId = 'apples';

  afterEach(() => {
    (<jest.Mock>webscraper).mockReset();
    (<jest.Mock>isValidModuleId).mockReset();
  });

  it('requests and parses the module details', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => $);

    await expect(moduleDetails(moduleId)).resolves.toEqual(mockModuleDetails);
    expect(isValidModuleId).toBeCalledWith(moduleId);
    expect(webscraper).toBeCalledWith(moduleDetailsURI);
  });

  it('throws an error if the module ID is invalid', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => false);

    await expect(moduleDetails(invalidModuleId)).rejects.toEqual(new Error('invalid module ID'));
    expect(isValidModuleId).toBeCalledWith(invalidModuleId);
    expect(webscraper).not.toBeCalled();
  });

  it('throws an error if the request fails', async () => {
    (<jest.Mock>isValidModuleId).mockImplementationOnce(() => true);
    (<jest.Mock>webscraper).mockImplementationOnce(async () => { throw new Error(); });

    await expect(moduleDetails(moduleId)).rejects.toEqual(new Error('failed to fetch module details from www.timetable.ul.ie'));
    expect(webscraper).toBeCalledWith(moduleDetailsURI);
  });
});
