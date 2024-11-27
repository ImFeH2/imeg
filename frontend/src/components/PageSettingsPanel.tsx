import {Settings2, X} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

interface PageSettings {
    responsive: boolean;
    width: number;
    height: number;
    maxWidth: string;
    bgColor: string;
}

interface PageSettingsPanelProps {
    settings: PageSettings;
    onUpdate: (settings: PageSettings) => void;
    onClose: () => void;
}

export function PageSettingsPanel({settings, onUpdate, onClose}: PageSettingsPanelProps) {
    const maxWidthOptions = [
        {value: 'none', label: 'None'},
        {value: 'max-w-3xl', label: '48rem (768px)'},
        {value: 'max-w-4xl', label: '56rem (896px)'},
        {value: 'max-w-5xl', label: '64rem (1024px)'},
        {value: 'max-w-6xl', label: '72rem (1152px)'},
        {value: 'max-w-7xl', label: '80rem (1280px)'}
    ];

    const handleChange = (key: keyof PageSettings, value: any) => {
        onUpdate({
            ...settings,
            [key]: value
        });
    };

    return (
        <Card className="w-80 border-l rounded-none h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
                <div className="flex items-center space-x-2">
                    <Settings2 className="w-4 h-4"/>
                    <CardTitle className="text-sm font-medium">Page Settings</CardTitle>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <X className="h-4 w-4"/>
                </button>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Responsive Mode Toggle */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="responsive-mode" className="font-medium">
                            Responsive Layout
                        </Label>
                        <Switch
                            id="responsive-mode"
                            checked={settings.responsive}
                            onCheckedChange={(checked) => handleChange('responsive', checked)}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Enable fluid layout that adapts to screen size
                    </p>
                </div>

                {/* Fixed Size Controls */}
                {!settings.responsive && (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="width">Width (px)</Label>
                            <Input
                                id="width"
                                type="number"
                                value={settings.width}
                                onChange={(e) => handleChange('width', Number(e.target.value))}
                                min={320}
                                max={1920}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="height">Height (px)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={settings.height}
                                onChange={(e) => handleChange('height', Number(e.target.value))}
                                min={200}
                            />
                        </div>
                    </div>
                )}

                {/* Max Width Selection for Responsive Mode */}
                {settings.responsive && (
                    <div className="grid gap-2">
                        <Label htmlFor="max-width">Maximum Width</Label>
                        <Select
                            value={settings.maxWidth}
                            onValueChange={(value) => handleChange('maxWidth', value)}
                        >
                            <SelectTrigger id="max-width">
                                <SelectValue placeholder="Select max width"/>
                            </SelectTrigger>
                            <SelectContent>
                                {maxWidthOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Limit the maximum width of the page content
                        </p>
                    </div>
                )}

                {/* Background Color */}
                <div className="grid gap-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2">
                        <div className="flex-shrink-0">
                            <input
                                type="color"
                                id="bg-color"
                                value={settings.bgColor}
                                onChange={(e) => handleChange('bgColor', e.target.value)}
                                className="w-10 h-10 p-0 border rounded cursor-pointer"
                            />
                        </div>
                        <Input
                            value={settings.bgColor}
                            onChange={(e) => handleChange('bgColor', e.target.value)}
                            placeholder="#FFFFFF"
                            className="flex-grow font-mono"
                        />
                    </div>
                </div>

                {/* Device Preview Hints */}
                {settings.responsive && (
                    <div className="rounded-md bg-muted p-3">
                        <h4 className="text-sm font-medium mb-2">Common Device Breakpoints</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>Mobile: 320px - 480px</p>
                            <p>Tablet: 481px - 768px</p>
                            <p>Laptop: 769px - 1024px</p>
                            <p>Desktop: 1025px+</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default PageSettingsPanel;
